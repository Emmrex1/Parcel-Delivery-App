import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  Search,
  LogOut,
  BarChart3,
  UserPlus,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { NavLink } from "@/components/NavLink";
import { logout } from "@/features/auth/authSlice";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Create Parcel",
    url: "/create-parcel",
    icon: PackagePlus,
  },
  {
    title: "Manage Parcels",
    url: "/manage-parcels",
    icon: Boxes,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Parcel Tracking",
    url: "/tracking",
    icon: Search,
  },
  {
    title: "Add Admin",
    url: "/add-admin",
    icon: UserPlus,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar content */}
      <SidebarContent>
        {/* Logo */}
        <div
          className={`flex items-center gap-2 px-4 py-5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-ring text-sidebar-primary font-bold text-sm">
            RX
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
                RapidXpress
              </span>

              <span className="text-[10px] text-sidebar-foreground/50">
                Admin Panel
              </span>
            </div>
          )}
        </div>

        {/* Main navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50">
              Menu
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <Icon className="h-4 w-4 shrink-0" />

                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar footer */}
      <SidebarFooter>
        {/* Logged-in user */}
        {!collapsed && (
          <div className="mb-2 rounded-lg bg-sidebar-accent/50 px-3 py-2">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name || "Administrator"}
            </p>

            <p className="truncate text-xs text-sidebar-foreground/50">
              {user?.email || "Admin account"}
            </p>
          </div>
        )}

        {/* Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4 shrink-0" />

              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
