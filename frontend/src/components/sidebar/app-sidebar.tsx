"use client"

import * as React from "react"

import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Switch } from "../ui/switch"
import { Moon, Sun } from "lucide-react"
import CreateNewChat from "../chat/CreateNewChat"
import NewGroupChatModel from "../chat/NewGroupChatModel"
import GroupChatList from "../chat/GroupChatList"
import AddFriendModel from "../chat/AddFriendModel"
import DirectMessageList from "../chat/DirectMessageList"
import { useThemeStore } from "@/stores/useThemeStore"
import { useAuthStore } from "@/stores/useAuthStore"
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isDark, toggleTheme} = useThemeStore();
  const { user } = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="bg-gradient-primary border border-white/30 rounded-full"
            >
              <a href="#">
                <div className="flex w-full items-center px-2 justify-between">

                  {/* Logo */}
                  <h1 className="text-xl font-bold text-white">Moji</h1>

                  {/* Theme toggle */}
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80" />

                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />

                    <Moon className="size-4 text-white/80" />
                  </div>

                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">

        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Nhóm chát
          </SidebarGroupLabel>
          <SidebarGroupAction title="Tạo Nhóm" className="cursor-pointer">
            <NewGroupChatModel />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Derict message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Bạn bè
          </SidebarGroupLabel>
          <SidebarGroupAction title="Kết Bạn" className="cursor-pointer">
            <AddFriendModel />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
