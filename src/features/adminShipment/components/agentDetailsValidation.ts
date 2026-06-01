import type { AgentFormData } from "../adminTypes";

export const validateAgentDetails = (AgentDetails: AgentFormData) => {
    const errors: Record<string, string> = {};

    if (!AgentDetails.name.trim()) {
        errors.name = "Agent Name is required"
    }

    if (!AgentDetails.email.trim()) {
        errors.email = "Agent email is required"
    }

    if (!AgentDetails.phoneNumber.trim()) {
        errors.phoneNumber = "Phone Number is required"
    }

    if (!AgentDetails.password.trim()) {
        errors.password = "Password is required"
    }

    if (!AgentDetails?.confirmPassword?.trim()) {
        errors.confirmPassword = "ConfirmPassword is required"
    } else if (AgentDetails?.confirmPassword.trim() !== AgentDetails.password.trim()) {
        errors.confirmPassword = "Passwords mismatched"
    }

    return errors;
}