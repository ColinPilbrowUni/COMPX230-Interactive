public sealed class ChecklistStateStore
{
    private readonly Dictionary<string, List<ChecklistStep>> levels = new(StringComparer.OrdinalIgnoreCase);
    private readonly Dictionary<string, int> selectedStepIndices = new(StringComparer.OrdinalIgnoreCase);

    public ChecklistStateStore()
    {
        ResetToDefaults();
    }

    public event Action? StateChanged;
    public event Action<string, int, ChecklistStepStatus>? SectionSelectionRequested;

    public void ResetToDefaults()
    {
        levels.Clear();
        selectedStepIndices.Clear();
        DefineLevel("levelFour", ["Shifting", "Masking", "Capitalization"], currentStepLabel: "Shifting");
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

        int initialSelectedStepIndex = 0;
        if (currentStepLabel != null)
        {
            int currentStepIndex = steps.FindIndex(step => string.Equals(step.Label, currentStepLabel, StringComparison.OrdinalIgnoreCase));
            if (currentStepIndex < 0)
            {
                throw new KeyNotFoundException($"Step '{currentStepLabel}' does not exist in level '{levelId}'.");
            }

            steps[currentStepIndex] = steps[currentStepIndex] with { Status = ChecklistStepStatus.Started };
            initialSelectedStepIndex = currentStepIndex;
        }

        levels[levelId] = steps;
        selectedStepIndices[levelId] = initialSelectedStepIndex;
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

    public bool TryGetSelectedStepIndex(string levelId, out int selectedStepIndex)
    {
        if (selectedStepIndices.TryGetValue(levelId, out int index))
        {
            selectedStepIndex = index;
            return true;
        }

        selectedStepIndex = 0;
        return false;
    }

    public void SetSelectedStepIndex(string levelId, int stepIndex)
    {
        if (!levels.TryGetValue(levelId, out List<ChecklistStep>? steps))
        {
            throw new KeyNotFoundException($"Level '{levelId}' was not found.");
        }

        if (stepIndex < 0 || stepIndex >= steps.Count)
        {
            throw new ArgumentOutOfRangeException(nameof(stepIndex));
        }

        if (selectedStepIndices.TryGetValue(levelId, out int currentIndex) && currentIndex == stepIndex)
        {
            return;
        }

        selectedStepIndices[levelId] = stepIndex;
        NotifyStateChanged();
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

    public bool RequestSectionSelection(string levelId, int stepIndex)
    {
        if (!levels.TryGetValue(levelId, out List<ChecklistStep>? steps))
        {
            return false;
        }

        if (stepIndex < 0 || stepIndex >= steps.Count)
        {
            return false;
        }

        ChecklistStepStatus status = steps[stepIndex].Status;
        if (status == ChecklistStepStatus.Incomplete)
        {
            return false;
        }

        SetSelectedStepIndex(levelId, stepIndex);
        SectionSelectionRequested?.Invoke(levelId, stepIndex, status);
        return true;
    }

    private void NotifyStateChanged()
    {
        StateChanged?.Invoke();
    }
}
