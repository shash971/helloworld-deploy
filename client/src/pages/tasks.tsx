import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";

export default function TasksPage() {
  const [, setLocation] = useLocation();
  
  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/role-login');
    }
  }, [setLocation]);

  // Mock tasks data - in a real app this would come from the API
  const upcomingTasks = [
    {
      id: 1,
      title: "IGI Certificate Pickup",
      description: "Pickup 5 certified diamonds from IGI Mumbai office",
      dueDate: "Tomorrow",
      priority: "High",
      icon: <i className="fas fa-certificate text-lg"></i>,
      iconColor: "error",
      status: "Pending"
    },
    {
      id: 2,
      title: "Inventory Count",
      description: "Complete quarterly physical inventory count for all stock",
      dueDate: "Jul 15, 2023",
      priority: "Medium",
      icon: <i className="fas fa-clipboard-list text-lg"></i>,
      iconColor: "warning",
      status: "Pending"
    },
    {
      id: 3,
      title: "Supplier Payment",
      description: "Process payment to Global Gems Ltd. for last month's purchase",
      dueDate: "Jul 18, 2023",
      priority: "Low",
      icon: <i className="fas fa-money-bill-wave text-lg"></i>,
      iconColor: "success",
      status: "Pending"
    },
    {
      id: 4,
      title: "Customer Delivery",
      description: "Prepare and ship diamond necklace for customer Maria Johnson",
      dueDate: "Jul 20, 2023",
      priority: "High",
      icon: <i className="fas fa-shipping-fast text-lg"></i>,
      iconColor: "primary",
      status: "In Progress"
    },
    {
      id: 5,
      title: "Staff Meeting",
      description: "Monthly staff meeting to discuss sales targets and inventory",
      dueDate: "Jul 25, 2023",
      priority: "Medium",
      icon: <i className="fas fa-users text-lg"></i>,
      iconColor: "info",
      status: "Not Started"
    }
  ];

  return (
    <MainLayout title="Tasks">
      <div className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Upcoming Tasks</h1>
          <p className="text-neutral-500">Manage and track your upcoming tasks and deadlines</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {upcomingTasks.map((task) => (
            <Card key={task.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-${task.iconColor}/10 text-${task.iconColor}`}>
                      {task.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-medium text-neutral-900">{task.title}</h4>
                      <span className="text-sm text-neutral-500">{task.dueDate}</span>
                    </div>
                    <p className="mt-1 text-neutral-600">{task.description}</p>
                    <div className="mt-3 flex items-center space-x-4">
                      <StatusBadge type="priority" value={task.priority} />
                      <StatusBadge type="status" value={task.status} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}