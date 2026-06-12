public sealed class ChecklistStateStore
{
    private readonly Dictionary<string, List<ChecklistStep>> levels = new(StringComparer.OrdinalIgnoreCase);

    public ChecklistStateStore()
    {
        ResetToDefaults();
    }

    public event Action? StateChanged;

    public void ResetToDefaults()
    {
        levels.Clear();
        DefineLevel("levelFour", ["Shifting", "Masking"], currentStepLabel: "Shifting");
        NotifyStateChanged();
    }

    public void DefineLevel(string levelId, IEnumerable<string> stepLabels, string? currentStepLabel = null)
    {
        if (string.IsNullOrWhiteSpace(levelId))
        {
            throw new ArgumentException("Level id is required.", nameof(levelId));
        }

        List<string> labels = stepLabels
            .Where(label => !string.IsNullOrWhiteSpace(label))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (labels.Count == 0)
        {
            throw new ArgumentException("A level must define at least one step.", nameof(stepLabels));
        }

        List<ChecklistStep> steps = labels
            .Select(label => new ChecklistStep(label, ChecklistStepStatus.Incomplete))
            .ToList();

        if (currentStepLabel != null)
        {
            int currentStepIndex = steps.FindIndex(step => string.Equals(step.Label, currentStepLabel, StringComparison.OrdinalIgnoreCase));
            if (currentStepIndex < 0)
            {
                throw new KeyNotFoundException($"Step '{currentStepLabel}' does not exist in level '{levelId}'.");
            }

            steps[currentStepIndex] = steps[currentStepIndex] with { Status = ChecklistStepStatus.Current };
        }

        levels[levelId] = steps;
        NotifyStateChanged();
    }

    public bool TryGetSteps(string levelId, out IReadOnlyList<ChecklistStep> steps)
    {
        if (levels.TryGetValue(levelId, out List<ChecklistStep>? foundSteps))
        {
            steps = foundSteps.ToArray();
            return true;
        }

        steps = [];
        return false;
    }

    public IReadOnlyList<ChecklistStep> GetSteps(string levelId)
    {
        if (!levels.TryGetValue(levelId, out List<ChecklistStep>? foundSteps))
        {
            throw new KeyNotFoundException($"Level '{levelId}' was not found.");
        }

        return foundSteps.ToArray();
    }

    public void Set(string levelId, string stepLabel, ChecklistStepStatus status)
    {
        if (!levels.TryGetValue(levelId, out List<ChecklistStep>? steps))
        {
            throw new KeyNotFoundException($"Level '{levelId}' was not found.");
        }

        int stepIndex = steps.FindIndex(step => string.Equals(step.Label, stepLabel, StringComparison.OrdinalIgnoreCase));
        if (stepIndex < 0)
        {
            throw new KeyNotFoundException($"Step '{stepLabel}' was not found in level '{levelId}'.");
        }

        if (steps[stepIndex].Status == status)
        {
            return;
        }

        steps[stepIndex] = steps[stepIndex] with { Status = status };
        NotifyStateChanged();
    }

    private void NotifyStateChanged()
    {
        StateChanged?.Invoke();
    }
}