import Notification from "../models/Notification.model";
import User from "../models/User.model";

interface NotificationPayload {
    user_id: string;
    type: string;
    title?: string;
    message?: string;
    data?: Record<string, unknown>;
    actionUrl?: string;
    actionLabel?: string;
    icon?: string;
    priority?: 'low' | 'medium' | 'high';
}

/**
 * Centralized notification service
 * Handles creation of notifications for all system events
 */
class NotificationService {
    /**
     * Create a notification (fire-and-forget, doesn't block main operation)
     */
    async createNotification(payload: NotificationPayload): Promise<void> {
        try {
            // Verify user exists
            const user = await User.findByPk(payload.user_id);
            if (!user) {
                console.error(`[NotificationService] User not found: ${payload.user_id}`);
                return;
            }

            await Notification.create({
                ...payload,
                read: false,
            });

            console.log(`[NotificationService] Created notification: ${payload.type} for user ${payload.user_id}`);
        } catch (error) {
            console.error('[NotificationService] Error creating notification:', error);
            // Don't throw - notifications should never block main operations
        }
    }

    /**
     * Create notifications for multiple users
     */
    async createBulkNotifications(userIds: string[], payload: Omit<NotificationPayload, 'user_id'>): Promise<void> {
        const promises = userIds.map(user_id =>
            this.createNotification({ ...payload, user_id })
        );
        await Promise.allSettled(promises);
    }

    // ==================== TASK NOTIFICATIONS ====================

    async notifyTaskAssigned(assigneeId: string, taskId: string, taskTitle: string, assignedBy: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'task.assigned',
            title: 'New Task Assigned',
            message: `You have been assigned to task: ${taskTitle}`,
            actionUrl: `/tasks/${taskId}`,
            actionLabel: 'View Task',
            icon: 'task',
            priority: 'high',
            data: { taskId, taskTitle, assignedBy },
        });
    }

    async notifyTaskUpdated(assigneeId: string, taskId: string, taskTitle: string, updatedBy: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'task.updated',
            title: 'Task Updated',
            message: `Task "${taskTitle}" has been updated`,
            actionUrl: `/tasks/${taskId}`,
            actionLabel: 'View Task',
            icon: 'task',
            priority: 'medium',
            data: { taskId, taskTitle, updatedBy },
        });
    }

    async notifyTaskCompleted(creatorId: string, taskId: string, taskTitle: string, completedBy: string): Promise<void> {
        await this.createNotification({
            user_id: creatorId,
            type: 'task.completed',
            title: 'Task Completed',
            message: `Task "${taskTitle}" has been marked as completed`,
            actionUrl: `/tasks/${taskId}`,
            actionLabel: 'View Task',
            icon: 'check',
            priority: 'medium',
            data: { taskId, taskTitle, completedBy },
        });
    }

    async notifyTaskOverdue(assigneeId: string, taskId: string, taskTitle: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'task.overdue',
            title: 'Task Overdue',
            message: `Task "${taskTitle}" is overdue`,
            actionUrl: `/tasks/${taskId}`,
            actionLabel: 'View Task',
            icon: 'alert',
            priority: 'high',
            data: { taskId, taskTitle },
        });
    }

    // ==================== PROJECT NOTIFICATIONS ====================

    async notifyProjectAssigned(userId: string, projectId: string, projectName: string, addedBy: string): Promise<void> {
        await this.createNotification({
            user_id: userId,
            type: 'project.assigned',
            title: 'Added to Project',
            message: `You have been added to project: ${projectName}`,
            actionUrl: `/projects/${projectId}`,
            actionLabel: 'View Project',
            icon: 'project',
            priority: 'high',
            data: { projectId, projectName, addedBy },
        });
    }

    async notifyProjectUpdated(userIds: string[], projectId: string, projectName: string, updatedBy: string): Promise<void> {
        await this.createBulkNotifications(userIds, {
            type: 'project.updated',
            title: 'Project Updated',
            message: `Project "${projectName}" has been updated`,
            actionUrl: `/projects/${projectId}`,
            actionLabel: 'View Project',
            icon: 'project',
            priority: 'low',
            data: { projectId, projectName, updatedBy },
        });
    }

    async notifyProjectMilestone(userIds: string[], projectId: string, projectName: string, milestone: string): Promise<void> {
        await this.createBulkNotifications(userIds, {
            type: 'project.milestone',
            title: 'Project Milestone Reached',
            message: `Project "${projectName}" reached milestone: ${milestone}`,
            actionUrl: `/projects/${projectId}`,
            actionLabel: 'View Project',
            icon: 'milestone',
            priority: 'medium',
            data: { projectId, projectName, milestone },
        });
    }

    // ==================== ACTIVITY NOTIFICATIONS ====================

    async notifyActivityAssigned(assigneeId: string, activityId: string, activityName: string, assignedBy: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'activity.assigned',
            title: 'New Activity Assigned',
            message: `You have been assigned to activity: ${activityName}`,
            actionUrl: `/activities/${activityId}`,
            actionLabel: 'View Activity',
            icon: 'activity',
            priority: 'high',
            data: { activityId, activityName, assignedBy },
        });
    }

    async notifyActivityUpdated(assigneeId: string, activityId: string, activityName: string, updatedBy: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'activity.updated',
            title: 'Activity Updated',
            message: `Activity "${activityName}" has been updated`,
            actionUrl: `/activities/${activityId}`,
            actionLabel: 'View Activity',
            icon: 'activity',
            priority: 'medium',
            data: { activityId, activityName, updatedBy },
        });
    }

    // ==================== APPROVAL NOTIFICATIONS ====================

    async notifyApprovalPending(approverId: string, approvalId: string, itemName: string, requestedBy: string): Promise<void> {
        await this.createNotification({
            user_id: approverId,
            type: 'approval.pending',
            title: 'Approval Required',
            message: `Approval requested for: ${itemName}`,
            actionUrl: `/approvals/${approvalId}`,
            actionLabel: 'Review',
            icon: 'approval',
            priority: 'high',
            data: { approvalId, itemName, requestedBy },
        });
    }

    async notifyApprovalApproved(requesterId: string, approvalId: string, itemName: string, approvedBy: string): Promise<void> {
        await this.createNotification({
            user_id: requesterId,
            type: 'approval.approved',
            title: 'Approval Granted',
            message: `Your request for "${itemName}" has been approved`,
            actionUrl: `/approvals/${approvalId}`,
            actionLabel: 'View',
            icon: 'check',
            priority: 'medium',
            data: { approvalId, itemName, approvedBy },
        });
    }

    async notifyApprovalRejected(requesterId: string, approvalId: string, itemName: string, rejectedBy: string, reason?: string): Promise<void> {
        await this.createNotification({
            user_id: requesterId,
            type: 'approval.rejected',
            title: 'Approval Rejected',
            message: `Your request for "${itemName}" has been rejected${reason ? `: ${reason}` : ''}`,
            actionUrl: `/approvals/${approvalId}`,
            actionLabel: 'View',
            icon: 'x',
            priority: 'high',
            data: { approvalId, itemName, rejectedBy, reason },
        });
    }

    // ==================== FINANCIAL NOTIFICATIONS ====================

    async notifyBudgetApproved(userId: string, budgetId: string, budgetName: string, approvedBy: string): Promise<void> {
        await this.createNotification({
            user_id: userId,
            type: 'budget.approved',
            title: 'Budget Approved',
            message: `Budget "${budgetName}" has been approved`,
            actionUrl: `/finance/budgets/${budgetId}`,
            actionLabel: 'View Budget',
            icon: 'money',
            priority: 'medium',
            data: { budgetId, budgetName, approvedBy },
        });
    }

    async notifyInvoiceCreated(userIds: string[], invoiceId: string, invoiceNumber: string, projectName: string): Promise<void> {
        await this.createBulkNotifications(userIds, {
            type: 'invoice.created',
            title: 'New Invoice Created',
            message: `Invoice ${invoiceNumber} created for project: ${projectName}`,
            actionUrl: `/finance/invoices/${invoiceId}`,
            actionLabel: 'View Invoice',
            icon: 'invoice',
            priority: 'medium',
            data: { invoiceId, invoiceNumber, projectName },
        });
    }

    async notifyPaymentProcessed(userIds: string[], paymentId: string, amount: number, projectName: string): Promise<void> {
        await this.createBulkNotifications(userIds, {
            type: 'payment.processed',
            title: 'Payment Processed',
            message: `Payment of ${amount} ETB processed for project: ${projectName}`,
            actionUrl: `/finance/payments/${paymentId}`,
            actionLabel: 'View Payment',
            icon: 'money',
            priority: 'medium',
            data: { paymentId, amount, projectName },
        });
    }

    // ==================== COLLABORATION NOTIFICATIONS ====================

    async notifyCollaborationAdded(userId: string, collaborationId: string, collaborationName: string, addedBy: string): Promise<void> {
        await this.createNotification({
            user_id: userId,
            type: 'collaboration.added',
            title: 'Added to Collaboration',
            message: `You have been added to: ${collaborationName}`,
            actionUrl: `/collaborations/${collaborationId}`,
            actionLabel: 'View',
            icon: 'users',
            priority: 'medium',
            data: { collaborationId, collaborationName, addedBy },
        });
    }

    async notifyCollaborationMessage(userIds: string[], collaborationId: string, collaborationName: string, senderName: string, message: string): Promise<void> {
        await this.createBulkNotifications(userIds, {
            type: 'collaboration.message',
            title: `New message in ${collaborationName}`,
            message: `${senderName}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
            actionUrl: `/collaborations/${collaborationId}`,
            actionLabel: 'View',
            icon: 'message',
            priority: 'low',
            data: { collaborationId, collaborationName, senderName },
        });
    }

    // ==================== FILE NOTIFICATIONS ====================

    async notifyFileShared(userId: string, fileId: string, fileName: string, sharedBy: string): Promise<void> {
        await this.createNotification({
            user_id: userId,
            type: 'file.shared',
            title: 'File Shared With You',
            message: `${sharedBy} shared a file: ${fileName}`,
            actionUrl: `/files/${fileId}`,
            actionLabel: 'View File',
            icon: 'file',
            priority: 'low',
            data: { fileId, fileName, sharedBy },
        });
    }

    // ==================== TODO NOTIFICATIONS ====================

    async notifyTodoAssigned(assigneeId: string, todoId: string, todoTitle: string, assignedBy: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'todo.assigned',
            title: 'New Todo Assigned',
            message: `You have been assigned a todo: ${todoTitle}`,
            actionUrl: `/todos/${todoId}`,
            actionLabel: 'View Todo',
            icon: 'check',
            priority: 'medium',
            data: { todoId, todoTitle, assignedBy },
        });
    }

    async notifyTodoUpdated(assigneeId: string, todoId: string, todoTitle: string, updatedBy: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'todo.updated',
            title: 'Todo Updated',
            message: `Todo \"${todoTitle}\" has been updated`,
            actionUrl: `/todos/${todoId}`,
            actionLabel: 'View Todo',
            icon: 'check',
            priority: 'low',
            data: { todoId, todoTitle, updatedBy },
        });
    }

    async notifyTodoCompleted(creatorId: string, todoId: string, todoTitle: string, completedBy: string): Promise<void> {
        await this.createNotification({
            user_id: creatorId,
            type: 'todo.completed',
            title: 'Todo Completed',
            message: `Todo \"${todoTitle}\" has been marked as completed`,
            actionUrl: `/todos/${todoId}`,
            actionLabel: 'View Todo',
            icon: 'check',
            priority: 'low',
            data: { todoId, todoTitle, completedBy },
        });
    }

    async notifyTodoOverdue(assigneeId: string, todoId: string, todoTitle: string): Promise<void> {
        await this.createNotification({
            user_id: assigneeId,
            type: 'todo.overdue',
            title: 'Todo Overdue',
            message: `Todo \"${todoTitle}\" is overdue`,
            actionUrl: `/todos/${todoId}`,
            actionLabel: 'View Todo',
            icon: 'alert',
            priority: 'high',
            data: { todoId, todoTitle },
        });
    }

    // ==================== MENTION NOTIFICATIONS ====================

    async notifyMention(userId: string, mentionedIn: string, mentionedBy: string, context: string, url: string): Promise<void> {
        await this.createNotification({
            user_id: userId,
            type: 'mention',
            title: 'You were mentioned',
            message: `${mentionedBy} mentioned you in ${mentionedIn}`,
            actionUrl: url,
            actionLabel: 'View',
            icon: 'at',
            priority: 'medium',
            data: { mentionedIn, mentionedBy, context },
        });
    }
}

export default new NotificationService();
