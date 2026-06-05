import { toast } from "react-toastify";
import succesSound from "../../assets/universfield-new-notification-051-494246.mp3";
import errorSound from "../../assets/soundshelfstudio-ui-drop-error-521939.mp3";
type ToastType = "success" | "error" | "info" | "warning";
export const showToast = ({
  type = "success",
  message = "",
  playSound = true,
}: {
  type?: ToastType;
  message?: string;
  playSound?: boolean;
}) => {
  if (playSound) {
    if (type == "success") {
      const audio = new Audio(succesSound);
      audio.play();
    } else {
      const audio = new Audio(errorSound);
      audio.play();
    }
  }
  toast[type](message);
};
