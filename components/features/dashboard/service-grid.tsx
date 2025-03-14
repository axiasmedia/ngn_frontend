"use client"

import { motion } from "framer-motion"
import { BookOpen, AlertTriangle, Ticket, ShoppingCart } from "lucide-react"

const serviceItems = [
  {
    title: "Help guides",
    description: "Access documentation and tutorials",
    icon: BookOpen,
    href: "/docs",
    color: "bg-blue-50 text-blue-600",
    hoverColor: "group-hover:bg-blue-100",
  },
  {
    title: "Report an issue",
    description: "Submit a new support ticket",
    icon: AlertTriangle,
    href: "/incidents",
    color: "bg-amber-50 text-amber-600",
    hoverColor: "group-hover:bg-amber-100",
  },
  {
    title: "View all tickets",
    description: "Check status of your requests",
    icon: Ticket,
    href: "/incidents/list",
    color: "bg-purple-50 text-purple-600",
    hoverColor: "group-hover:bg-purple-100",
  },
  {
    title: "Order something",
    description: "Browse available products and services",
    icon: ShoppingCart,
    href: "/catalog",
    color: "bg-emerald-50 text-emerald-600",
    hoverColor: "group-hover:bg-emerald-100",
  },
]

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export function ServiceGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {serviceItems.map((item, index) => (
        <motion.div
          key={item.title}
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.a href={item.href} className="block h-full group">
            <div className="bg-white rounded-lg border shadow-sm h-full transition-all duration-200 hover:shadow-md overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div
                  className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 transition-colors duration-200 ${item.color} ${item.hoverColor}`}
                >
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>

                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
                  <span>Get started</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                    className="ml-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6.66669 3.33331L10.6667 7.99998L6.66669 12.6666"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.a>
        </motion.div>
      ))}
    </motion.div>
  )
}

