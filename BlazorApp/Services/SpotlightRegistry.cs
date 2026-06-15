using Microsoft.AspNetCore.Components;

public class SpotlightRegistry
{
    private readonly Dictionary<string, ElementReference> _map = new();

    public void Register(string key, ElementReference element)
    {
        _map[key] = element;
    }

    public ElementReference Get(string key)
    {
        return _map[key];
    }

    public bool TryGet(string key, out ElementReference element)
    {
        return _map.TryGetValue(key, out element);
    }
}