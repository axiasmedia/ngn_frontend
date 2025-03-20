"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket, Users, ClipboardList, Calendar, BarChart3, MessageSquare, FileText, HardDrive, ShoppingCart, Shield, UserCog, } from 'lucide-react'
import Link from "next/link"

export default function TechnicianServiceGrid() {
  const { userRole } = useAuth()
  const isAdmin = userRole === "Admin"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  interface ServiceCard {
    title: string
    description: string
    icon: React.ReactNode
    href: string
    color: string
    iconColor: string
    badge?: string
  }

  const serviceCards: ServiceCard[] = [
    {
      title: "Ticket Management",
      description: "View and manage all support tickets",
      icon: <Ticket className="h-12 w-12 text-blue-500" />,
      href: "/technician/tickets",
      color: "bg-blue-50 dark:bg-blue-950",
      iconColor: "text-blue-500",
    },
    {
      title: "Create Ticket",
      description: "Create a new support ticket",
      icon: <ClipboardList className="h-12 w-12 text-green-500" />,
      href: "/technician/tickets/new",
      color: "bg-green-50 dark:bg-green-950",
      iconColor: "text-green-500",
    },
    {
      title: "User Management",
      description: "View users by company",
      icon: <UserCog className="h-12 w-12 text-purple-500" />,
      href: "/technician/users",
      color: "bg-purple-50 dark:bg-purple-950",
      iconColor: "text-purple-500",
    },
    {
      title: "Client Management",
      description: "View and manage client information",
      icon: <Users className="h-12 w-12 text-indigo-500" />,
      href: "/technician/clients",
      color: "bg-indigo-50 dark:bg-indigo-950",
      iconColor: "text-indigo-500",
    },
    {
      title: "Knowledge Base",
      description: "Access technical documentation and guides",
      icon: <FileText className="h-12 w-12 text-amber-500" />,
      href: "/technician/knowledge",
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-500",
    },
    {
      title: "Equipment Inventory",
      description: "Manage hardware and equipment inventory",
      icon: <HardDrive className="h-12 w-12 text-rose-500" />,
      href: "/technician/equipment",
      color: "bg-rose-50 dark:bg-rose-950",
      iconColor: "text-rose-500",
    },
    {
      title: "Product Catalog",
      description: "Browse available products and services",
      icon: <ShoppingCart className="h-12 w-12 text-cyan-500" />,
      href: "/technician/catalog",
      color: "bg-cyan-50 dark:bg-cyan-950",
      iconColor: "text-cyan-500",
    },
    {
      title: "Schedule",
      description: "View and manage your work schedule",
      icon: <Calendar className="h-12 w-12 text-indigo-500" />,
      href: "/technician/schedule",
      color: "bg-indigo-50 dark:bg-indigo-950",
      iconColor: "text-indigo-500",
    },
    {
      title: "Reports",
      description: "Generate and view performance reports",
      icon: <BarChart3 className="h-12 w-12 text-orange-500" />,
      href: "/technician/reports",
      color: "bg-orange-50 dark:bg-orange-950",
      iconColor: "text-orange-500",
    },
    {
      title: "Messages",
      description: "Internal communication system",
      icon: <MessageSquare className="h-12 w-12 text-teal-500" />,
      href: "/technician/messages",
      color: "bg-teal-50 dark:bg-teal-950",
      iconColor: "text-teal-500",
    },
  ]

  // Add admin dashboard card if user is an admin
  if (isAdmin) {
    serviceCards.push({
      title: "Admin Dashboard",
      description: "Access administrative controls and settings",
      icon: <Shield className="h-12 w-12 text-red-500" />,
      href: "/admin/dashboard",
      color: "bg-red-50 dark:bg-red-950",
      iconColor: "text-red-500",
      badge: "Admin",
    })
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {serviceCards.map((card, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Link href={card.href} className="block h-full">
            <Card
              className={`h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/20`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${card.iconColor.replace("text", "bg")}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  {card.badge && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      {card.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg inline-flex ${card.color}`}>{card.icon}</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-start">
                  Access {card.title}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
