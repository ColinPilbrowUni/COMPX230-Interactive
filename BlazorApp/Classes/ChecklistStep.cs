public enum ChecklistStepStatus
{
    Incomplete,
    Current,
    Complete
}

public record ChecklistStep(string Label, ChecklistStepStatus Status);