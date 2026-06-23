using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Text.Json;

public class LevelComponents
{
    private IJSRuntime? JSRuntime;
    private string? progressScopeId;

    public LevelComponents() {}

    public void SetJSRuntime(IJSRuntime JSRuntime)
    {
        this.JSRuntime = JSRuntime;
    }

    public void SetProgressScope(string? scopeId)
    {
        progressScopeId = scopeId;
    }

    public async Task getProgress()
    {
        if (JSRuntime != null)
        {
            _section = await GetStoredProgress("Section");
            _block = await GetStoredProgress("Block");
        }

    }

    public int Section
    {
        get { return _section; }
        set
        {
            _section = value;
            StoreProgress("Section", _section);
        }
    }

    private int _section = 0;

    public int Block
    {
        get { return _block; }
        set
        {
            _block = value;
            StoreProgress("Block", _block);
        }
    }

    private int _block = 0;

    public void NextBlock()
    {
        if (Block < 1)
            Block++;
        //InvokeBoardChanged is invoked to trigger any UI updates caused by CheckBoard()
        JSRuntime?.InvokeVoidAsync("InvokeBoardChanged");
    }

    public void PrevBlock()
    {
        if (Block > 0)
            Block--;
        //InvokeBoardChanged is invoked to trigger any UI updates caused by CheckBoard()
        JSRuntime?.InvokeVoidAsync("InvokeBoardChanged");
    }

    /// <summary>
    /// Toggle a checkmark depending on the state of goal
    /// </summary>
    /// <param name="goal">Goal to be checked</param>
    /// <param name="checkmarkID">ID of checkmark to be toggled</param>
    public void CheckObjective(bool goal, string checkmarkID)
    {
        JSRuntime?.InvokeVoidAsync(goal ? "objectiveCheck" : "objectiveUncheck", checkmarkID);
    }

    /// <summary>
    /// Hide all visible checkmarks
    /// </summary>
    public void UncheckAllObjectives()
    {
        JSRuntime?.InvokeVoidAsync("objectiveUncheckAll");
    }

    /// <summary>
    /// Mark the current level as completed. Adds a checkmark next to the level name on the level selector
    /// </summary>
    public void LevelCompleted()
    {
        JSRuntime?.InvokeVoidAsync("levelCompleted");
    }

    /// <summary>
    /// </summary>
    /// <returns>WRAMP Code from the Blockly workspace</returns>
    public async Task<string> GetUserCode()
    {
        if (JSRuntime != null)
        {
            return await JSRuntime.InvokeAsync<string>("getGeneratedCode");
        }
        return "";
    }

    /// <summary>
    /// Update the Blockly toolbox
    /// </summary>
    /// <param name="toolbox"></param>
    /// <returns></returns>
    public async Task UpdateToolbox(Toolbox toolbox)
    {
        if (JSRuntime != null)
        {
            await JSRuntime.InvokeVoidAsync("updateToolbox", JsonSerializer.Serialize(toolbox));
        }
    }

    private async Task<int> GetStoredProgress(string type)
    {
        if (JSRuntime == null)
        {
            return 0;
        }

        if (!string.IsNullOrWhiteSpace(progressScopeId))
        {
            return await JSRuntime.InvokeAsync<int>("getScopedProgress", progressScopeId, type);
        }

        return await JSRuntime.InvokeAsync<int>("getProgress", type);
    }

    private void StoreProgress(string type, int value)
    {
        if (JSRuntime == null)
        {
            return;
        }

        if (!string.IsNullOrWhiteSpace(progressScopeId))
        {
            JSRuntime.InvokeVoidAsync("storeScopedProgress", progressScopeId, type, value);
            return;
        }

        JSRuntime.InvokeVoidAsync("storeProgress", type, value);
    }
}