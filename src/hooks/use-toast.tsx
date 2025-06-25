
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        if (toastTimeouts.has(toastId)) {
          return state
        }

        const timeout = setTimeout(() => {
          toastTimeouts.delete(toastId)
          // We can't dispatch here anymore since we removed global dispatch
        }, TOAST_REMOVE_DELAY)

        toastTimeouts.set(toastId, timeout)
      } else {
        state.toasts.forEach((toast) => {
          if (!toastTimeouts.has(toast.id)) {
            const timeout = setTimeout(() => {
              toastTimeouts.delete(toast.id)
            }, TOAST_REMOVE_DELAY)
            toastTimeouts.set(toast.id, timeout)
          }
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Context for toast state and actions
interface ToastContextType {
  state: State
  dispatch: React.Dispatch<Action>
  addToast: (toast: Omit<ToasterToast, "id">) => string
  dismissToast: (toastId?: string) => void
  updateToast: (toastId: string, toast: Partial<ToasterToast>) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

// Provider component that should wrap the app
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })
  
  const addToast = React.useCallback((toastProps: Omit<ToasterToast, "id">) => {
    const id = genId()
    
    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...toastProps,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dispatch({ type: "DISMISS_TOAST", toastId: id })
          }
        },
      },
    })
    
    return id
  }, [])

  const dismissToast = React.useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId })
  }, [])

  const updateToast = React.useCallback((toastId: string, toastProps: Partial<ToasterToast>) => {
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...toastProps, id: toastId },
    })
  }, [])

  const contextValue = React.useMemo(() => ({
    state,
    dispatch,
    addToast,
    dismissToast,
    updateToast
  }), [state, dispatch, addToast, dismissToast, updateToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}

function useToast() {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    // Provide a safe fallback that doesn't use React hooks
    return {
      toasts: [],
      toast: () => {
        console.warn('Toast called outside of ToastProvider context')
        return { id: '', dismiss: () => {}, update: () => {} }
      },
      dismiss: () => {
        console.warn('Toast dismiss called outside of ToastProvider context')
      },
    }
  }

  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = context.addToast(props)
    
    return {
      id,
      dismiss: () => context.dismissToast(id),
      update: (updateProps: Partial<ToasterToast>) => context.updateToast(id, updateProps),
    }
  }, [context])

  return {
    toasts: context.state.toasts,
    toast,
    dismiss: context.dismissToast,
  }
}

// Standalone toast function for backwards compatibility
const toast = (props: Omit<ToasterToast, "id">) => {
  console.warn('Standalone toast function called - consider using useToast hook instead')
  return { id: '', dismiss: () => {}, update: () => {} }
}

export { useToast, toast }
