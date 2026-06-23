using Microsoft.JSInterop;

public sealed record LevelGroupPart(string Id, string Label, string ProgressScopeId);

public sealed class LevelGroupGateway
{
    public const string ActivePartProgressType = "Part";

    private readonly List<LevelGroupPart> parts;

    public LevelGroupGateway(string levelId, IEnumerable<LevelGroupPart> parts)
    {
        if (string.IsNullOrWhiteSpace(levelId))
        {
            throw new ArgumentException("Level id is required.", nameof(levelId));
        }

        this.parts = parts?.ToList() ?? throw new ArgumentNullException(nameof(parts));
        if (this.parts.Count == 0)
        {
            throw new ArgumentException("At least one level part is required.", nameof(parts));
        }

        LevelId = levelId;
        CurrentPartIndex = 0;
    }

    public string LevelId { get; }

    public int CurrentPartIndex { get; private set; }

    public IReadOnlyList<LevelGroupPart> Parts => parts;

    public LevelGroupPart CurrentPart => parts[CurrentPartIndex];

    public async Task InitializeAsync(IJSRuntime jsRuntime, ChecklistStateStore checklistState)
    {
        checklistState.DefineLevel(LevelId, parts.Select(p => p.Label), currentStepLabel: parts[0].Label);

        int savedPartIndex = await jsRuntime.InvokeAsync<int>("getScopedProgress", LevelId, ActivePartProgressType);
        SetCurrentPartIndex(savedPartIndex, checklistState);
    }

    public async Task SelectPartAsync(int partIndex, IJSRuntime jsRuntime, ChecklistStateStore checklistState)
    {
        SetCurrentPartIndex(partIndex, checklistState);
        await jsRuntime.InvokeVoidAsync("storeScopedProgress", LevelId, ActivePartProgressType, CurrentPartIndex);
    }

    public bool IsValidIndex(int partIndex)
    {
        return partIndex >= 0 && partIndex < parts.Count;
    }

    public ChecklistStepStatus GetPartStatus(ChecklistStateStore checklistState, int partIndex)
    {
        if (!checklistState.TryGetSteps(LevelId, out IReadOnlyList<ChecklistStep>? steps))
        {
            return ChecklistStepStatus.Incomplete;
        }

        if (!IsValidIndex(partIndex) || partIndex >= steps.Count)
        {
            return ChecklistStepStatus.Incomplete;
        }

        return steps[partIndex].Status;
    }

    public void SetPartStatusWithoutDowngrade(ChecklistStateStore checklistState, int partIndex, ChecklistStepStatus desiredStatus)
    {
        if (!IsValidIndex(partIndex))
        {
            return;
        }

        ChecklistStepStatus currentStatus = GetPartStatus(checklistState, partIndex);
        if (desiredStatus < currentStatus)
        {
            return;
        }

        checklistState.Set(LevelId, parts[partIndex].Label, desiredStatus);
    }

    private void SetCurrentPartIndex(int partIndex, ChecklistStateStore checklistState)
    {
        if (!IsValidIndex(partIndex))
        {
            partIndex = 0;
        }

        CurrentPartIndex = partIndex;
        checklistState.SetSelectedStepIndex(LevelId, CurrentPartIndex);
    }
}
