import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Square, 
  Activity, 
  Globe, 
  Zap, 
  Clock, 
  Users, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Monitor,
  Download,
  Filter
} from 'lucide-react';

interface TestConfig {
  targetUrl: string;
  method: string;
  threads: number;
  duration: number;
  rateLimit: number;
  payload: string;
  headers: Record<string, string>;
  followRedirects: boolean;
  timeout: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

interface Metrics {
  requestsSent: number;
  responsesReceived: number;
  successRate: number;
  avgResponseTime: number;
  bandwidth: number;
  errors: number;
  statusCodes: Record<string, number>;
}

interface TestStatus {
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  startTime?: Date;
  elapsedTime: number;
}

const DDoSStressTestingInterface: React.FC = () => {
  const [config, setConfig] = useState<TestConfig>({
    targetUrl: 'https://example.com',
    method: 'GET',
    threads: 10,
    duration: 60,
    rateLimit: 100,
    payload: '',
    headers: { 'User-Agent': 'StressTester/1.0' },
    followRedirects: true,
    timeout: 30
  });

  const [status, setStatus] = useState<TestStatus>({
    isRunning: false,
    isPaused: false,
    progress: 0,
    elapsedTime: 0
  });

  const [metrics, setMetrics] = useState<Metrics>({
    requestsSent: 0,
    responsesReceived: 0,
    successRate: 0,
    avgResponseTime: 0,
    bandwidth: 0,
    errors: 0,
    statusCodes: {}
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const filtered = logs.filter(log => 
      logFilter === 'all' || log.type === logFilter
    );
    setFilteredLogs(filtered);
  }, [logs, logFilter]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs]);

  const validateConfig = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!config.targetUrl || !config.targetUrl.match(/^https?:\/\/.+/)) {
      newErrors.targetUrl = 'Please enter a valid URL';
    }
    
    if (config.threads < 1 || config.threads > 1000) {
      newErrors.threads = 'Threads must be between 1 and 1000';
    }
    
    if (config.duration < 1 || config.duration > 3600) {
      newErrors.duration = 'Duration must be between 1 and 3600 seconds';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addLog = (type: LogEntry['type'], message: string, details?: any) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      message,
      details
    };
    
    setLogs(prev => [...prev, newLog]);
  };

  const simulateMetrics = () => {
    setMetrics(prev => {
      const newRequestsSent = prev.requestsSent + Math.floor(Math.random() * 50) + 10;
      const newResponsesReceived = prev.responsesReceived + Math.floor(Math.random() * 45) + 8;
      const newErrors = prev.errors + Math.floor(Math.random() * 3);
      
      return {
        requestsSent: newRequestsSent,
        responsesReceived: newResponsesReceived,
        successRate: ((newResponsesReceived / newRequestsSent) * 100),
        avgResponseTime: Math.random() * 500 + 100,
        bandwidth: Math.random() * 1000 + 500,
        errors: newErrors,
        statusCodes: {
          '200': Math.floor(newResponsesReceived * 0.7),
          '404': Math.floor(newResponsesReceived * 0.1),
          '500': Math.floor(newResponsesReceived * 0.1),
          '503': Math.floor(newResponsesReceived * 0.1)
        }
      };
    });
  };

  const startTest = () => {
    if (!validateConfig()) return;
    
    setStatus({
      isRunning: true,
      isPaused: false,
      progress: 0,
      startTime: new Date(),
      elapsedTime: 0
    });
    
    setMetrics({
      requestsSent: 0,
      responsesReceived: 0,
      successRate: 0,
      avgResponseTime: 0,
      bandwidth: 0,
      errors: 0,
      statusCodes: {}
    });
    
    addLog('info', `Starting stress test on ${config.targetUrl}`);
    addLog('info', `Configuration: ${config.threads} threads, ${config.duration}s duration`);
    
    intervalRef.current = setInterval(() => {
      setStatus(prev => {
        const newElapsed = prev.elapsedTime + 1;
        const newProgress = (newElapsed / config.duration) * 100;
        
        if (newProgress >= 100) {
          stopTest();
          return prev;
        }
        
        return {
          ...prev,
          elapsedTime: newElapsed,
          progress: newProgress
        };
      });
      
      simulateMetrics();
      
      // Simulate random log entries
      if (Math.random() > 0.7) {
        const logTypes: LogEntry['type'][] = ['info', 'success', 'warning', 'error'];
        const messages = [
          'Connection established',
          'Response received: 200 OK',
          'High response time detected',
          'Connection timeout',
          'Rate limit exceeded',
          'Target server responding normally'
        ];
        
        addLog(
          logTypes[Math.floor(Math.random() * logTypes.length)],
          messages[Math.floor(Math.random() * messages.length)]
        );
      }
    }, 1000);
  };

  const pauseTest = () => {
    setStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
    addLog('warning', status.isPaused ? 'Test resumed' : 'Test paused');
  };

  const stopTest = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setStatus({
      isRunning: false,
      isPaused: false,
      progress: 100,
      elapsedTime: 0
    });
    
    addLog('info', 'Stress test completed');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Layer 7 DDoS Stress Testing</h1>
            <p className="text-muted-foreground">Configure and monitor HTTP/HTTPS load testing</p>
          </div>
          <Badge variant={status.isRunning ? "destructive" : "secondary"} className="px-3 py-1">
            {status.isRunning ? (status.isPaused ? 'Paused' : 'Running') : 'Idle'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target-url">Target URL</Label>
                  <Input
                    id="target-url"
                    value={config.targetUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, targetUrl: e.target.value }))}
                    placeholder="https://example.com"
                    className={errors.targetUrl ? "border-red-500" : ""}
                  />
                  {errors.targetUrl && (
                    <p className="text-sm text-red-500">{errors.targetUrl}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>HTTP Method</Label>
                    <Select value={config.method} onValueChange={(value) => setConfig(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (s)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={config.timeout}
                      onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 30 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Thread Count: {config.threads}</Label>
                  <Slider
                    value={[config.threads]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, threads: value[0] }))}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  {errors.threads && (
                    <p className="text-sm text-red-500">{errors.threads}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Duration: {config.duration}s</Label>
                  <Slider
                    value={[config.duration]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, duration: value[0] }))}
                    max={300}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">{errors.duration}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Rate Limit (req/s): {config.rateLimit}</Label>
                  <Slider
                    value={[config.rateLimit]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, rateLimit: value[0] }))}
                    max={1000}
                    min={1}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="follow-redirects"
                    checked={config.followRedirects}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, followRedirects: checked }))}
                  />
                  <Label htmlFor="follow-redirects">Follow Redirects</Label>
                </div>

                <Tabs defaultValue="payload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="payload">Payload</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="payload" className="space-y-2">
                    <Label>Request Payload</Label>
                    <Textarea
                      value={config.payload}
                      onChange={(e) => setConfig(prev => ({ ...prev, payload: e.target.value }))}
                      placeholder="Enter request body (JSON, XML, etc.)"
                      rows={4}
                    />
                  </TabsContent>
                  <TabsContent value="headers" className="space-y-2">
                    <Label>Custom Headers</Label>
                    <Textarea
                      value={JSON.stringify(config.headers, null, 2)}
                      onChange={(e) => {
                        try {
                          const headers = JSON.parse(e.target.value);
                          setConfig(prev => ({ ...prev, headers }));
                        } catch {}
                      }}
                      placeholder='{"Authorization": "Bearer token"}'
                      rows={4}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={startTest}
                    disabled={status.isRunning}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                  <Button
                    onClick={pauseTest}
                    disabled={!status.isRunning}
                    variant="outline"
                  >
                    {status.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={stopTest}
                    disabled={!status.isRunning}
                    variant="destructive"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>

                {status.isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{formatTime(status.elapsedTime)} / {formatTime(config.duration)}</span>
                    </div>
                    <Progress value={status.progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Panel */}
          <div className="space-y-6">
            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Real-time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Requests Sent</p>
                    <p className="text-2xl font-bold">{metrics.requestsSent.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Responses</p>
                    <p className="text-2xl font-bold">{metrics.responsesReceived.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="text-2xl font-bold">{metrics.avgResponseTime.toFixed(0)}ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Bandwidth</p>
                    <p className="text-2xl font-bold">{(metrics.bandwidth / 1024).toFixed(1)} KB/s</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold text-red-500">{metrics.errors}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Status Code Distribution</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(metrics.statusCodes).map(([code, count]) => (
                      <Badge key={code} variant="outline">
                        {code}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Console Output */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Console Output
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-4" ref={logContainerRef}>
                  <div className="space-y-2 font-mono text-sm">
                    {filteredLogs.length === 0 ? (
                      <p className="text-muted-foreground">No logs to display</p>
                    ) : (
                      filteredLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2 p-2 rounded border">
                          {getLogIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {log.type}
                              </Badge>
                            </div>
                            <p className="text-sm break-words">{log.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This tool is for authorized testing only. Ensure you have proper permission before testing any target system. Unauthorized stress testing may violate terms of service and local laws.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default DDoSStressTestingInterface;