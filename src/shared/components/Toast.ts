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
    const audio = new Audio(
      type === "success" ? succesSound : errorSound
    );
    audio.play();
  }

  toast[type](message, {
    style: {
      minHeight: "48px",
      padding: "10px 14px",
      borderRadius: "10px",
      fontSize: "14px",
    },
  });
};