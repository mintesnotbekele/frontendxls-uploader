import React, { useState } from "react";
import {
  AntdLayout,
  Menu,
  useMenu,
  useTitle,
  useNavigation,
  Grid,
  Icons
} from "@pankod/refine";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";

export const CustomSider: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const Title = useTitle();
  const { menuItems, selectedKey } = useMenu();
  const breakpoint = Grid.useBreakpoint();
  const { push } = useNavigation();

  const isMobile = !breakpoint.lg;

  return (
    <AntdLayout.Sider
      collapsible
      theme="light"
      width={'clamp(250px, 100%,12.5vw)'}
      collapsedWidth={isMobile ? 0 : 80}
      collapsed={collapsed}
      breakpoint="lg"
      onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
      style={{...(isMobile ? antLayoutSiderMobile : antLayoutSider), background:'#0000'}}
    >
      <style>
        {`
          .ant-layout-sider-trigger {
            background: #0000 !important;
          }
        `}
      </style>
      <Title collapsed={collapsed} />
      <Menu
        selectedKeys={[selectedKey]}
        style={{
          backgroundColor: '#0000'
        }}
        mode="inline"
        onClick={({ key }) => {
          if (!breakpoint.lg) {
            setCollapsed(true);
          }
          push(key as string);
        }}
      >
        {menuItems.map(({ icon, label, route }) => {
          const isSelected = route === selectedKey;
          return (
            <Menu.Item
              style={{
                fontWeight: isSelected ? "bold" : "normal",
                backgroundColor: '#0000'
              }}
              key={route}
              icon={icon}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {label}
                {!collapsed && isSelected && <Icons.RightOutlined />}
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    </AntdLayout.Sider>
  );
};
