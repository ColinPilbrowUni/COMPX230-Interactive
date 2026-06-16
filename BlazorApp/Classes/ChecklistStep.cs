public enum ChecklistStepStatus
{
    Incomplete,
    Started,
    Complete
}

public record ChecklistStep(string Label, ChecklistStepStatus Status);