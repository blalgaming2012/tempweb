import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getTasksByWorkerId, updateTask } from '@/services/storage';
import type { Task, TaskStatus } from '@/types';
import { Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function WorkerTasks() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = () => {
    if (!user) return;
    const myTasks = getTasksByWorkerId(user.id);
    setTasks(myTasks);
  };

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
    toast({
      title: t('workerTasks.messages.updateSuccess'),
      description: t('workerTasks.messages.updateSuccessDesc'),
    });
    loadTasks();
  };

  const handleSaveNotes = () => {
    if (!selectedTask) return;
    
    updateTask(selectedTask.id, { notes });
    toast({
      title: t('common.save'),
      description: t('workerTasks.messages.updateSuccessDesc'),
    });
    setIsDetailsDialogOpen(false);
    loadTasks();
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setNotes(task.notes || '');
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadge = (status: TaskStatus) => {
    const statusConfig = {
      pending: { label: t('workerTasks.statuses.pending'), variant: 'secondary' as const, icon: AlertCircle },
      in_progress: { label: t('workerTasks.statuses.in_progress'), variant: 'default' as const, icon: Clock },
      completed: { label: t('workerTasks.statuses.completed'), variant: 'default' as const, icon: CheckCircle2 },
      cancelled: { label: t('serviceRequests.statuses.cancelled'), variant: 'destructive' as const, icon: AlertCircle },
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    const priorityConfig = {
      low: { label: t('workerTasks.priorities.low'), variant: 'secondary' as const },
      medium: { label: t('workerTasks.priorities.medium'), variant: 'default' as const },
      high: { label: t('workerTasks.priorities.high'), variant: 'destructive' as const },
    };
    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  return (
    <div className="container py-8">
      <div className="parallax-bg" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">{t('workerTasks.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.stats.assignedToYou')}</p>
      </div>

      <div className="mb-6">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('workerTasks.filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('workerTasks.all')}</SelectItem>
            <SelectItem value="pending">{t('workerTasks.statuses.pending')}</SelectItem>
            <SelectItem value="in_progress">{t('workerTasks.statuses.in_progress')}</SelectItem>
            <SelectItem value="completed">{t('workerTasks.statuses.completed')}</SelectItem>
            <SelectItem value="cancelled">{t('serviceRequests.statuses.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{task.title}</CardTitle>
                  <CardDescription>
                    {task.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{t('serviceRequests.createdAt')}: {new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}

                {task.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">{t('serviceRequests.description')}:</p>
                    <p className="text-sm text-muted-foreground">{task.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Select 
                    value={task.status}
                    onValueChange={(value) => handleUpdateStatus(task.id, value as TaskStatus)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('workerTasks.updateStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('workerTasks.statuses.pending')}</SelectItem>
                      <SelectItem value="in_progress">{t('workerTasks.statuses.in_progress')}</SelectItem>
                      <SelectItem value="completed">{t('workerTasks.statuses.completed')}</SelectItem>
                      <SelectItem value="cancelled">{t('serviceRequests.statuses.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTaskDetails(task)}
                    className="gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {t('common.view')}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  {t('serviceRequests.createdAt')}: {new Date(task.createdAt).toLocaleString('ar-SA')}
                  {task.completedAt && (
                    <> | {t('workerTasks.completedAt')}: {new Date(task.completedAt).toLocaleString('ar-SA')}</>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{t('common.noData')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('workerTasks.taskDetails')}</DialogTitle>
            <DialogDescription>
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">{t('serviceRequests.description')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('workerTasks.addNotesPlaceholder')}
                rows={6}
                dir="rtl"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSaveNotes}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
