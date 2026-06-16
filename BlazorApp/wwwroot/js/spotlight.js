window.getRect = (el) => {
    if (!el || typeof el.getBoundingClientRect !== 'function') return null;

    const r = el.getBoundingClientRect();

    return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    };
};

let _walkthroughEscRef = null;
let _walkthroughEscHandler = null;

window.walkthroughRegisterEsc = (dotNetRef) => {
    _walkthroughEscRef = dotNetRef;
    _walkthroughEscHandler = (e) => {
        if (e.key === 'Escape') _walkthroughEscRef.invokeMethodAsync('EscPressed');
    };
    document.addEventListener('keydown', _walkthroughEscHandler);
};

window.walkthroughUnregisterEsc = () => {
    if (_walkthroughEscHandler) {
        document.removeEventListener('keydown', _walkthroughEscHandler);
        _walkthroughEscHandler = null;
        _walkthroughEscRef = null;
    }
};

window.activateTab = (el) => {
    if (!el) return;
    const tab = bootstrap.Tab.getOrCreateInstance(el);
    tab.show();
};

window.activateCollapse = (el) => {
    if (!el) return;

    const targetSelector = el.getAttribute('data-bs-target');
    const targetId = el.getAttribute('aria-controls');
    const target =
        (targetSelector ? document.querySelector(targetSelector) : null) ||
        (targetId ? document.getElementById(targetId) : null);

    if (!target) return;

    const collapse = bootstrap.Collapse.getOrCreateInstance(target, { toggle: false });
    collapse.toggle();
};

window.isCollapseShown = (el) => {
    if (!el) return false;

    const targetSelector = el.getAttribute('data-bs-target');
    const targetId = el.getAttribute('aria-controls');
    const target =
        (targetSelector ? document.querySelector(targetSelector) : null) ||
        (targetId ? document.getElementById(targetId) : null);

    if (!target) return false;
    return target.classList.contains('show');
};

window.showCollapse = (el) => {
    if (!el) return;

    const targetSelector = el.getAttribute('data-bs-target');
    const targetId = el.getAttribute('aria-controls');
    const target =
        (targetSelector ? document.querySelector(targetSelector) : null) ||
        (targetId ? document.getElementById(targetId) : null);

    if (!target) return;

    const collapse = bootstrap.Collapse.getOrCreateInstance(target, { toggle: false });
    collapse.show();
};

window.hideCollapse = (el) => {
    if (!el) return;

    const targetSelector = el.getAttribute('data-bs-target');
    const targetId = el.getAttribute('aria-controls');
    const target =
        (targetSelector ? document.querySelector(targetSelector) : null) ||
        (targetId ? document.getElementById(targetId) : null);

    if (!target) return;

    const collapse = bootstrap.Collapse.getOrCreateInstance(target, { toggle: false });
    collapse.hide();
};