import { notification } from "@pankod/refine";
import { NotificationPlacement, IconType } from "antd/lib/notification";
export const openNotification = (
  message: string,
  type: IconType,
  placement?: NotificationPlacement | undefined
) => {
  notification.open({
    type,
    message: `${message}`,
    description: placement,
  });
};
