
import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

interface InteractionMetric {
  action: string;
  timestamp: number;
  component: string;
}

// Global toggle for performance monitoring
let globalPerformanceEnabled = false;

export function enablePerformanceMonitoring(enabled: boolean = true) {
  globalPerformanceEnabled = enabled;
  logger.info('PerformanceMonitor', `Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
}

export function usePerformanceMonitor(componentName: string, enabled: boolean = false) {
  const renderStartTime = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const interactionsRef = useRef<InteractionMetric[]>([]);
  const isProduction = process.env.NODE_ENV === 'production';

  // Only monitor when explicitly enabled AND (in development OR global flag is set)
  const shouldMonitor = enabled && (!isProduction || globalPerformanceEnabled);

  useEffect(() => {
    if (!shouldMonitor) return;
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (!shouldMonitor) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    // Only log slow renders (>16ms = 60fps threshold)
    if (renderTime > 16) {
      const metric: PerformanceMetrics = {
        componentName,
        renderTime,
        timestamp: Date.now()
      };

      metricsRef.current.push(metric);

      // Keep only last 10 metrics to prevent memory leaks
      if (metricsRef.current.length > 10) {
        metricsRef.current = metricsRef.current.slice(-10);
      }

      // Only warn about very slow renders (>100ms)
      if (renderTime > 100) {
        logger.warn('PerformanceMonitor', `Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      } else if (renderTime > 50) {
        logger.debug('PerformanceMonitor', `Moderate render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  const trackInteraction = useCallback((action: string) => {
    if (!shouldMonitor) return;
    
    const interaction: InteractionMetric = {
      action,
      timestamp: Date.now(),
      component: componentName
    };
    
    interactionsRef.current.push(interaction);
    
    // Keep only last 20 interactions
    if (interactionsRef.current.length > 20) {
      interactionsRef.current = interactionsRef.current.slice(-20);
    }
    
    logger.debug('PerformanceMonitor', `${componentName} interaction: ${action}`);
  }, [shouldMonitor, componentName]);

  const getMetrics = useCallback(() => {
    return shouldMonitor ? metricsRef.current : [];
  }, [shouldMonitor]);

  const getInteractions = useCallback(() => {
    return shouldMonitor ? interactionsRef.current : [];
  }, [shouldMonitor]);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    interactionsRef.current = [];
  }, []);

  const getPerformanceReport = useCallback(() => {
    if (!shouldMonitor) return null;

    const metrics = metricsRef.current;
    const interactions = interactionsRef.current;
    
    const avgRenderTime = metrics.length > 0 
      ? metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length 
      : 0;
    
    return {
      componentName,
      totalRenders: metrics.length,
      avgRenderTime: avgRenderTime.toFixed(2),
      slowRenders: metrics.filter(m => m.renderTime > 100).length,
      totalInteractions: interactions.length,
      recentMetrics: metrics.slice(-5),
      recentInteractions: interactions.slice(-5)
    };
  }, [shouldMonitor, componentName]);

  return {
    getMetrics,
    getInteractions,
    clearMetrics,
    trackInteraction,
    getPerformanceReport,
    isMonitoring: shouldMonitor
  };
}
