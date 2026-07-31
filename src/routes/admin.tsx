import { createFileRoute, redirect, Outlet, useLocation } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { AuthProvider } from '@/hooks/use-auth'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') {
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw redirect({
        to: '/admin/login',
      })
    }
  },
  component: AdminLayoutRoute,
})

function AdminLayoutRoute() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/admin/login'

  return (
    <AuthProvider>
      {isLoginPage ? <Outlet /> : <AdminLayout />}
    </AuthProvider>
  )
}
