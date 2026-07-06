window.levelSelect = () =>
{
    //Account for the edge case of the main page not having a path name
    let domain = window.location.pathname.split('/');
    let levelID = domain[domain.length - 1];

    let level = document.querySelector('a[href="' + ((levelID === '') ? '.' : levelID) + '"]');

    //Highlight the link as active, and set aria-active to the current link
    level.classList.add('active');
    level.setAttribute('aria-current', 'page');
}

window.levelCheck = () =>
{
    //Get all <a> tags that link to another level
    const levelElements = document.querySelectorAll('a.nav-link');

    for (let i = 0; i < levelElements.length; i++)
    {
        href = levelElements[i].pathname.substring(1);
        if (localStorage.getItem(href) != null)
        {
            //Show the checkmark
            let checkmark = levelElements[i].getElementsByClassName('inputCheckmark')[0];
            checkmark.style.opacity = 1;

            //Change to white for the currently selected level
            if (levelElements[i].classList.contains('active')) checkmark.style.color = 'white';
        }
    }
}

window.levelCompleted = () =>
{
    let domain = window.location.pathname.split('/');
    let levelID = domain[domain.length - 1];
    localStorage.setItem(levelID === '' ? 'sandbox' : levelID, true);
    levelCheck();
}

window.resetLevels = () =>
{
    const modalDiv = document.getElementById('deleteModalBody');
    modalDiv.innerHTML = '';
    document.querySelectorAll('.levelLink').forEach( element => {
        let levelName = element.innerText.replace('✔', '');
        let domain  = element.href.split('/');
        let levelID = (domain[domain.length - 1] === '' ? 'sandbox' : domain[domain.length - 1]);

        modalDiv.innerHTML += `<input class="mb-1 me-1 form-check-input deleteCheckbox" id="${levelID}" type="checkbox"><label class="form-check-label" for="${levelID}">${levelName}</label><br>`;
    });
}

window.deleteLevelProgress = () =>
{
    const keys = Object.keys(localStorage);
    document.querySelectorAll('.deleteCheckbox').forEach(checkbox => {
        if (checkbox.checked === true)
        {
            keys.forEach(key => {
                if (key.includes(checkbox.id))
                {
                    localStorage.removeItem(key);
                }
            });
        }
    });
    window.location.reload();
}

window.selectAllLevels = () =>
{
    document.querySelectorAll('.deleteCheckbox').forEach(checkbox => {
        checkbox.checked = true;
    });
}

window.codeSaved = true;

window.saveCode = async (Library) =>
{
    let codeDiv = document.getElementById('wsimCode');
    let code = '';

    //Add the user's code (if there is any)
    if (codeDiv != null)
    {
        code = document.getElementById('wsimCode').innerHTML;
        code = code.replaceAll('<br>', '\n');
        code = code.replaceAll('&emsp;', '\t');
    }
    //Add any library code
    if (Library != null)
    {
        code += '\n' + Library + '\n';
    }
    //Add the provided EQUs
    code += `\n\n#Provided EQUs:
    .equ sp1_tx,      0x70000
    .equ sp1_rx,      0x70001
    .equ sp1_ctrl,    0x70002
    .equ sp1_stat,    0x70003
    .equ sp1_iack,    0x70004
    .equ par_switch,  0x73000
    .equ par_btn,	  0x73001
    .equ par_ctrl,    0x73004
    .equ par_iack,    0x73005
    .equ par_ulssd,   0x73006
    .equ par_urssd,   0x73007
    .equ par_llssd,   0x73008
    .equ par_lrssd,   0x73009
    .equ par_led,     0x7300A`;

    //Determine the name for the file
    let domain = window.location.pathname.split('/');
    let levelID = domain[domain.length - 1];
    saveFile(code, levelID === '' ? 'sandboxCode.s' : `${levelID}Code.s`);
}

window.setWsimCode = (code) =>
{
    const codeArea = document.getElementById('wsimCode');
    if (!codeArea) return;

    const safeCode = (code ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');

    codeArea.innerHTML = safeCode
        .replaceAll('\n', '<br>')
        .replaceAll('\t', '&emsp;');
}

window.saveFile = async (content, name) =>
{
    let index = name.indexOf('.');
    let nameWithDate = name.slice(0, index) + new Date().toISOString().split('T')[0] + name.slice(index);

    const file = new Blob([content], { type: 'text/plain' });

    const link = document.createElement('a');
    link.download = nameWithDate;
    link.href = URL.createObjectURL(file);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    codeSaved = true;
}

window.addEventListener('beforeunload', function (e) {
    if (codeSaved == false)
    {
        triggerPopover('Save your Blockly workspace or WRAMP code first!');
        e.preventDefault();
    }
});

window.checkCodeSaved = () =>
{
    return codeSaved;
}

window.quacker = () =>
{
    let audio = document.getElementById('duckQuack');
    audio.play();
}

window.evilquacker = () =>
{
    let audio = document.getElementById('kcauQkcud');
    audio.play();
}

var dotNetReference = null;

window.setAppDotNetRef = (dotnetRef) =>
{
    dotNetReference = dotnetRef;
}

window.InvokeBoardChanged = () =>
{
    if (dotNetReference != null)
    {
        dotNetReference.invokeMethodAsync('InvokeBoardChanged');
    }
}

window.objectiveCheck = (id) =>
{
    const checkmark = document.getElementById(id);
    if (!checkmark) return;

    if (!checkmark.classList.contains('visible'))
    {
        checkmark.classList.add('visible');
    }
}

window.objectiveUncheck = (id) =>
{
    const checkmark = document.getElementById(id);
    if (!checkmark) return;

    if (checkmark.classList.contains('visible'))
    {
        checkmark.classList.remove('visible');
        // document.getElementById('kcauQkcud')?.play();
    }
}

window.objectiveUncheckAll = () =>
{
    const checkmarks = document.getElementsByClassName('inputCheckmark');

    for (let i = 0; i < checkmarks.length; i++) {
        id = checkmarks[i].id;
        objectiveUncheck(id);
    }
}

window.storeProgress = (type, section) =>
{
    let domain = window.location.pathname.split('/');
    let levelID = domain[domain.length - 1];
    id = (levelID === '' ? 'sandbox' : levelID) + type;
    localStorage.setItem(id, section);
}

window.getProgress = (type) =>
{
    let domain = window.location.pathname.split('/');
    let levelID = domain[domain.length - 1];
    id = (levelID === '' ? 'sandbox' : levelID) + type;
    return Number(localStorage.getItem(id)) || 0;
}

window.getLevelProgress = (levelID, type) =>
{
    id = levelID + type;
    return Number(localStorage.getItem(id)) || 0;
}

window.storeScopedProgress = (scopeID, type, value) =>
{
    id = scopeID + type;
    localStorage.setItem(id, value);
}

window.getScopedProgress = (scopeID, type) =>
{
    id = scopeID + type;
    return Number(localStorage.getItem(id)) || 0;
}

var popover;

window.triggerPopover = (error) =>
{
    //Clear any existing popovers
    clearPopovers();

    //Create new popover with provided error message
    var popoverElement = document.getElementById('compileButton');
    popoverElement.setAttribute('data-bs-content', error);
    popover = new bootstrap.Popover(popoverElement);
    popover.show();
}

window.clearPopovers = () =>
{
    document.querySelectorAll('.popover').forEach(popoverElement => {
        popoverElement.remove();
    });
}

window.initPopper = () =>
{
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}

const htmlElement = document.documentElement;

window.switchTheme = () =>
{
    const theme = htmlElement.getAttribute('data-bs-theme');

    //Flip theme to opposite
    if (theme == 'light' || theme == 'null')
    {
        setTheme('dark');
    }
    else
    {
        setTheme('light');
    }
}

window.setTheme = (themeType) =>
{
    const imgElement = document.getElementById('themeSwitcher');
    const imgName = 'img/' + themeType + '.svg';

    htmlElement.setAttribute('data-bs-theme', themeType);
    localStorage.setItem('theme', themeType);
    switchBlocklyTheme(themeType);
    imgElement.src = imgName;
}

window.initTheme = () =>
{
    const theme = htmlElement.getAttribute('data-bs-theme');
    const imgElement = document.getElementById('themeSwitcher');
    const imgName = 'img/' + theme + '.svg';
    if (theme != 'null')
    {
        imgElement.src = imgName;
    }
    else
    {
        imgElement.src = 'img/light.svg';
    }

}

window.changeFormat = (id, instruction) =>
{
    const decimalRegexPattern = /^-?(6[0-5]{2}[0-3][0-5]|[1-5][0-9]{4}|[1-9][0-9]{0,3}|0)$/;
    const hexRegexPattern = /^0x[0-9a-fA-F]{1,4}$/;
    const binaryRegexPattern = /^0b[0-1]+$/;
    const charRegexPattern = /^\'([ -~]|\\a|\\n|\\r)\'$/;

    let element = document.getElementById(id);
    if (!element) return;

    let value = element.innerText;

    //0: Decimal, 1: Hex, 2: Binary, 3: Char
    if (decimalRegexPattern.test(value)) format = 0;
    if (hexRegexPattern.test(value)) format = 1;
    if (binaryRegexPattern.test(value)) format = 2;
    if (charRegexPattern.test(value)) format = 3;
    format = (format + 1) % 4;

    //Display the value
    switch(format)
    {
        case 0:
            switch (value)
            {
                case '\'\\a\'':
                    element.innerText = '7';
                    break;
                case '\'\\n\'':
                    element.innerText = '10';
                    break;
                case '\'\\r\'':
                    element.innerText = '13';
                    break;
                default:
                    element.innerText = (value.charCodeAt(1));
                    break;
            }
            break;
        case 1:
            if (id == 'visualiseImmed')
            {
                let string = (parseInt(value) >>> 0).toString(16).toUpperCase();
                if (string.length > 6)
                {
                    element.innerText = `0x${string.substring(4)}`;
                }
                else
                {
                    element.innerText = `0x${string}`;
                }
            }
            else
            {
                element.innerText = `0x${(parseInt(value) >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
            }
            break;
        case 2:
            element.innerText = `0b${parseInt(value).toString(2).padStart((id == 'visualiseImmed') ? 16 : 32, '0')}`;
            break;
        case 3:
            value = getSignedInt(value.replace("0b", ""), instruction);
            switch (value)
            {
                case 7:
                    string = '\'\\a\'';
                    break;
                case 10:
                    string = '\'\\n\'';
                    break;
                case 13:
                    string = '\'\\r\'';
                    break;
                default:
                    string = `\'${String.fromCharCode(value)}\'`;
                    break;
            }

            if (charRegexPattern.test(string))
            {
                element.innerText = (string);
            }
            else
            {
                element.innerText = (value);
            }
            break;
        default:
            break;
    }
}

window.getSignedInt = (bits, instruction) =>
{
    if (bits[0] === '1' && instruction != null && !instruction.includes('ui'))
    {
        let inverse = '';
        for (i = 0; i < bits.length; i++)
        {
            inverse += (bits[i] === '0' ? '1' : '0');
        }
        return (parseInt(inverse, 2) + 1) * -1;
    }
    else
    {
        return parseInt(bits, 2);
    }
}

window.updateVisualiser = (id, value) =>
{
    let element = document.getElementById(id);
    if (!element) return;
    element.innerText = value;
}

window.updateSign = (instruction) =>
{
    const sign = document.getElementById('visualiseSign');
    if (!sign) return;

    //Display the appropriate sign for the current instruction
    switch (true)
    {
        case instruction.includes('add'):
            sign.innerText = '+';
            break;
        case instruction.includes('sub'):
            sign.innerText = '-';
            break;
        case instruction.includes('mult'):
            sign.innerText = '*';
            break;
        case instruction.includes('div'):
            sign.innerText = '÷';
            break;
        case instruction.includes('rem'):
            sign.innerText = '%';
            break;
        case instruction.includes('and'):
            sign.innerText = '&';
            break;
        case instruction.includes('xor'):
            sign.innerText = '^';
            break;
        case instruction.includes('or'):
            sign.innerText = '|';
            break;
        case instruction.includes('sr'):
            sign.innerText = '>>';
            break;
        case instruction.includes('sl'):
            sign.innerText = '<<';
            break;
        default:
            break;
    }
}