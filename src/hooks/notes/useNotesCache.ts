
import { useState, useEffect, useCallback, useRef } from 'react';
import { Note } from '@/lib/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useNotesCache() {
  const cache = useRef(new Map<string, CacheEntry<any>>());

  const getCacheKey = useCallback((filters: any) => {
    return JSON.stringify(filters);
  }, []);

  const get = useCallback(<T>(key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback(<T>(key: string, data: T) => {
    const now = Date.now();
    cache.current.set(key, {
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    });
  }, []);

  const invalidate = useCallback((pattern?: string) => {
    if (pattern) {
      // Remove entradas que contêm o padrão
      const keysToDelete = Array.from(cache.current.keys()).filter(key => 
        key.includes(pattern)
      );
      keysToDelete.forEach(key => cache.current.delete(key));
    } else {
      // Limpa todo o cache
      cache.current.clear();
    }
  }, []);

  const getSize = useCallback(() => cache.current.size, []);

  // Limpeza automática de entradas expiradas
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const expiredKeys = Array.from(cache.current.entries())
        .filter(([_, entry]) => now > entry.expiresAt)
        .map(([key]) => key);
      
      expiredKeys.forEach(key => cache.current.delete(key));
    }, 60000); // Executa a cada minuto

    return () => clearInterval(cleanup);
  }, []);

  return {
    get,
    set,
    invalidate,
    getSize,
    getCacheKey
  };
}
