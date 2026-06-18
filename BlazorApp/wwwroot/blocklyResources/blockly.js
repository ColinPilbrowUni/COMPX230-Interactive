let blocklyStorage;
let presetCode;
let presetWorkspace;
let compiledCode;

window.initBlockly = (tool, instances, startingWorkspace) =>
{
    toolbox = JSON.parse(tool);
    if (instances != null)
    {
        instances = instances.replaceAll("\'", "\"");
    }
    let Instances = JSON.parse(instances);
    workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox, theme: lightModeTheme, maxInstances: Instances, sounds: false});
    window.codeSaved = true;

    let domains = window.location.pathname.split('/');
    let levelID = domains[domains.length - 1];
    blocklyStorage = (levelID === '' ? 'sandbox' : levelID) + 'Blockly';

    if (startingWorkspace != null)
    {
        presetWorkspace = startingWorkspace;
    }

    //Load any saved code from the user's previous sessions, and if there is none load the code the level provides
    let state = localStorage.getItem(blocklyStorage);
    if (state != null)
    {
        loadWorkspace(state);
    }
    else if (startingWorkspace != null)
    {
        loadWorkspace(startingWorkspace);
        presetCode = generateCode();
        presetWorkspace = startingWorkspace;
    }
}

window.generateCode = (compiling) =>
{
    const code = wrampGenerator.workspaceToCode(workspace);
    if (compiling == true) compiledCode = code;
    return code;
}

window.highlightBlock = (id) =>
{
    workspace.highlightBlock(id);
}

const fullToolbox =
{
    kind: 'categoryToolbox',
    contents:
    [
        {   name: 'Sections',
            kind: 'category',
            categorystyle: 'sectionCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'textHead'
                },
                {
                    kind: 'block',
                    type: 'global'
                },
                {
                    kind: 'block',
                    type: 'dataHead'
                },
                {
                    kind: 'block',
                    type: 'bssHead'
                }
            ]
        },
        {   name: 'Branch',
            kind: 'category',
            categorystyle: 'branchCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'label'
                },
                {
                    kind: 'block',
                    type: 'jump'
                },
                {
                    kind: 'block',
                    type: 'jumpRegister'
                },
                {
                    kind: 'block',
                    type: 'branchOn'
                }
            ]
        },
        {   name: 'Memory',
            kind: 'category',
            categorystyle: 'memoryCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'loadWord'
                },
                {
                    kind: 'block',
                    type: 'storeWord'
                },
                {
                    kind: 'block',
                    type: 'loadAddress'
                },
                {
                    kind: 'block',
                    type: 'word'
                },
                {
                    kind: 'block',
                    type: 'asciiz'
                },
                {
                    kind: 'block',
                    type: 'ascii'
                },
                {
                    kind: 'block',
                    type: 'space'
                },
                {
                    kind: 'block',
                    type: 'equ'
                }
            ]
        },
        {   name: 'Arithmetic',
            kind: 'category',
            categorystyle: 'arithmeticCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'arithmetic'
                },
                {
                    kind: 'block',
                    type: 'arithmeticUnsigned'
                },
                {
                    kind: 'block',
                    type: 'arithmeticImmediate'
                },
                {
                    kind: 'block',
                    type: 'arithmeticUnsignedImmediate'
                },
                {
                    kind: 'block',
                    type: 'loadHighImmediate'
                }
            ]
        },
        {   name: 'Logic',
            kind: 'category',
            categorystyle: 'logicCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'bitwise'
                },
                {
                    kind: 'block',
                    type: 'bitwiseImmediate'
                },
                {
                    kind: 'block',
                    type: 'shift'
                },
                {
                    kind: 'block',
                    type: 'shiftImmediate'
                }
            ]
        },
        {   name: 'Conditional',
            kind: 'category',
            categorystyle: 'conditionalCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'setOn'
                },
                {
                    kind: 'block',
                    type: 'setOnUnsigned'
                },
                {
                    kind: 'block',
                    type: 'setOnImmediate'
                },
                {
                    kind: 'block',
                    type: 'setOnUnsignedImmediate'
                },
            ]
        },
        {   name: 'Special',
            kind: 'category',
            categorystyle: 'specialCategory',
            contents:
            [
                {
                    kind: 'block',
                    type: 'moveGeneralToSpecial'
                },
                {
                    kind: 'block',
                    type: 'moveSpecialToGeneral'
                },
                {
                    kind: 'block',
                    type: 'break'
                },
                {
                    kind: 'block',
                    type: 'syscall'
                },
                {
                    kind: 'block',
                    type: 'returnFromException'
                }
            ]
        }
    ]
};

const lightModeTheme = Blockly.Theme.defineTheme('lightModeTheme',
{
    base: Blockly.Themes.Classic,
    startHats: true,
    categoryStyles:
    {
        sectionCategory:
        {
            colour: '#ebc106'
        },
        branchCategory:
        {
            colour: '#01579b'
        },
        memoryCategory:
        {
            colour: '#17add3'
        },
        arithmeticCategory:
        {
            colour: '#4a148c'
        },
        logicCategory:
        {
            colour: '#12ba43'
        },
        conditionalCategory:
        {
            colour: '#911111'
        },
        specialCategory:
        {
            colour: '#bd31b1'
        }
    },
    blockStyles:
    {
        sectionBlocks:
        {
            colourPrimary: '#ebc106'
        },
        branchBlocks:
        {
            colourPrimary: '#01579b'
        },
        memoryBlocks:
        {
            colourPrimary: '#17add3'
        },
        arithmeticBlocks:
        {
            colourPrimary: '#4a148c'
        },
        logicBlocks:
        {
            colourPrimary: '#12ba43'
        },
        conditionalBlocks:
        {
            colourPrimary: '#911111'
        },
        specialBlocks:
        {
            colourPrimary: '#bd31b1'
        }
    }
});

const darkModeTheme = Blockly.Theme.defineTheme('darkModeTheme',
{
    base: lightModeTheme,
    startHats: true,
    componentStyles:
    {
        workspaceBackgroundColour: '#1e1e1e',
        toolboxBackgroundColour: '#333',
        toolboxForegroundColour: '#fff',
        flyoutBackgroundColour: '#252526',
        flyoutForegroundColour: '#ccc',
        flyoutOpacity: 1,
        scrollbarColour: '#797979',
        insertionMarkerColour: '#fff',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#d0d0d0',
    }
});

const definitions = Blockly.common.createBlockDefinitionsFromJsonArray([
    {   type: 'global',
        style: 'sectionBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.global main'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Makes the label "main" global to serve as an entry point to the program'
    },
    {   type: 'textHead',
        style: 'sectionBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.text'}
        ],
        nextStatement: null,
        tooltip: 'Defines the beginning of a .text section, which should contain WRAMP instructions'
    },
    {   type: 'dataHead',
        style: 'sectionBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.data'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Defines the beginning of a .data section, which should contain strings, constants, or variables with initial values'
    },
    {   type: 'bssHead',
        style: 'sectionBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.bss'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Defines the beginning of a .bss section, which declares reserved but uninitialised memory. Useful for arrays.'
    },
    {   type: 'label',
        style: 'branchBlocks',
        message0: '%1:',
        args0:
        [
            {type: 'field_input', name: 'label', text: 'label'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Creates a label which can be jumped to using instructions such as j, jal, jr, beqz, etc.',
        extensions: ['labelValidator']
    },
    {   type: 'jump',
        style: 'branchBlocks',
        message0: '%1 %2',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['j', 'j'], ['jal', 'jal']]},
            {type: 'field_input', name: 'address'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func address\nJump to the address provided. For jal, save the address of the next instruction in $ra'
    },
    {   type: 'jumpRegister',
        style: 'branchBlocks',
        message0: '%1 %2',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['jr', 'jr'], ['jalr', 'jalr']]},
            {type: 'field_input', name: 'register', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func register\nJump to the register provided. For jalr, save the address of the next instruction in $ra',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'branchOn',
        style: 'branchBlocks',
        message0: '%1 %2, %3',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['beqz', 'beqz'], ['bnez', 'bnez']]},
            {type: 'field_input', name: 'register', text: '$_'},
            {type: 'field_input', name: 'offset'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rs, offset\nConditionally branch the number of instructions specified by the sign-extended offset if register Rs is/is not equal to 0.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'loadWord',
        style: 'memoryBlocks',
        message0: '%1 %2, %3(%4)',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'lw'},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'offset'},
            {type: 'field_input', name: 'register2', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func lw Rd, Offset(Rs)\nCombine the contents of register Rs and the offset to give an effective memory address. Load the contents of that address into register Rd.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'storeWord',
        style: 'memoryBlocks',
        message0: '%1 %2, %3(%4)',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'sw'},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'offset'},
            {type: 'field_input', name: 'register2', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func lw Rd, Offset(Rs)\nCombine the contents of register Rs and the offset to give an effective memory address. Store the contents of register Rd into that address.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'loadAddress',
        style: 'memoryBlocks',
        message0: 'la %1, %2',
        args0:
        [
            {type: 'field_input', name: 'register', text: '$_'},
            {type: 'field_input', name: 'address'},
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func la Rd, Address\nPut the address into register Rd.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'word',
        style: 'memoryBlocks',
        message0: '%1 %2',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.word'},
            {type: 'field_input', name: 'string'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Assigns one word of memory space and initialises it to the value provided.'
    },
    {   type: 'asciiz',
        style: 'memoryBlocks',
        message0: '%1 "%2"',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.asciiz '},
            {type: 'field_input', name: 'string'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Initialises space for the ASCII string provided, adding a NULL terminator'
    },
    {   type: 'ascii',
        style: 'memoryBlocks',
        message0: '%1 "%2"',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.ascii'},
            {type: 'field_input', name: 'string'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Initialises space for the ASCII string provided, without NULL terminating'
    },
    {   type: 'space',
        style: 'memoryBlocks',
        message0: '%1 %2',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.space'},
            {type: 'field_number', name: 'string'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Allocate a chunk of space of the inputted size in the .bss section'
    },
    {
        type: 'equ',
        style: 'memoryBlocks',
        message0: '%1 %2,%3 %4',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: '.equ'},
            {type: 'field_input', name: 'alias'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Create a named constant, which serves as an alias to the value provided.',
        extensions: ['immediateValidator']
    },
    {   type: 'arithmetic',
        style: 'arithmeticBlocks',
        message0: '%1 %2, %3, %4',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['add', 'add'], ['sub', 'sub'], ['mult', 'mult'], ['div', 'div'], ['rem', 'rem']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_input', name: 'register3', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func, Rd, Rs, Rt\nPuts the result of performing the instruction func on registers Rs and Rt in register Rd. Generate an overflow exception on signed overflow.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'arithmeticUnsigned',
        style: 'arithmeticBlocks',
        message0: '%1 %2, %3, %4',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['addu', 'addu'], ['subu', 'subu'], ['multu', 'multu'], ['divu', 'divu'], ['remu', 'remu']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_input', name: 'register3', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func, Rd, Rs, Rt\nPuts the result of performing the instruction func on registers Rs and Rt in register Rd. Generate an overflow exception on unsigned overflow.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'arithmeticImmediate',
        style: 'arithmeticBlocks',
        message0: '%1 %2, %3,%4 %5',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['addi', 'addi'], ['subi', 'subi'], ['multi', 'multi'], ['divi', 'divi'], ['remi', 'remi']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func, Rd, Rs, Immediate\nPuts the result of performing the instruction func on register Rs and the immediate in register Rd. Generate an overflow exception on signed overflow.',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'arithmeticUnsignedImmediate',
        style: 'arithmeticBlocks',
        message0: '%1 %2, %3,%4 %5',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['addui', 'addui'], ['subui', 'subui'], ['multui', 'multui'], ['divui', 'divui'], ['remui', 'remui']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func, Rd, Rs, Immediate\nPuts the result of performing the instruction func on register Rs and the immediate in register Rd. Generate an overflow exception on unsigned overflow.',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'loadHighImmediate',
        style: 'arithmeticBlocks',
        message0: '%1 %2,%3 %4',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'lhi'},
            {type: 'field_input', name: 'register', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'lhi Rd, Immediate\nPut the 16 bit immediate in the upper 16 bits of register Rd, and set the lower 16 bits to 0',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'bitwise',
        style: 'logicBlocks',
        message0: '%1 %2, %3, %4',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['and', 'and'], ['or', 'or'], ['xor', 'xor']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_input', name: 'register3', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, Rt\nPerform the logical operation func on registers Rs and Rt, storing the result in Rd',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'bitwiseImmediate',
        style: 'logicBlocks',
        message0: '%1 %2, %3,%4 %5',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['andi', 'andi'], ['ori', 'ori'], ['xori', 'xori']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, immediate\nPerform the logical operation func on register Rs and the immediate, storing the result in Rd',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'shift',
        style: 'logicBlocks',
        message0: '%1 %2, %3, %4',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['sll', 'sll'], ['srl', 'srl'], ['sra', 'sra']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_input', name: 'register3', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, Rt\nShift the bits in the direction defined by func in register Rs by the amount in Rt, storing the result in Rd',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'shiftImmediate',
        style: 'logicBlocks',
        message0: '%1 %2, %3,%4 %5',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['slli', 'slli'], ['srli', 'srli'], ['srai', 'srai']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, immediate\nShift the bits in the direction defined by func in register Rs by the amount in the immediate, storing the result in Rd',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'setOn',
        style: 'conditionalBlocks',
        message0: '%1 %2, %3, %4',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['slt', 'slt'], ['sgt', 'sgt'], ['sle', 'sle'], ['sge', 'sge'], ['seq', 'seq'], ['sne', 'sne']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_input', name: 'register3', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, Rt\nPerform logical operation func on registers Rs and Rt. Set Rd to 1 if true, 0 otherwise.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'setOnUnsigned',
        style: 'conditionalBlocks',
        message0: '%1 %2, %3, %4',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['sltu', 'sltu'], ['sgtu', 'sgtu'], ['sleu', 'sleu'], ['sgeu', 'sgeu'], ['sequ', 'sequ'], ['sneu', 'sneu']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_input', name: 'register3', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, Rt\nPerform logical operation func on registers Rs and Rt. Set Rd to 1 if true, 0 otherwise.',
        extensions: ['generalRegisterValidator']
    },
    {   type: 'setOnImmediate',
        style: 'conditionalBlocks',
        message0: '%1 %2, %3,%4 %5',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['slti', 'slti'], ['sgti', 'sgti'], ['slei', 'slei'], ['sgei', 'sgei'], ['seqi', 'seqi'], ['snei', 'snei']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, immediate\nPerform logical operation func on register Rs and the immediate. Set Rd to 1 if true, 0 otherwise.',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'setOnUnsignedImmediate',
        style: 'conditionalBlocks',
        message0: '%1 %2, %3,%4 %5',
        args0:
        [
            {type: 'field_dropdown', name: 'instruction', options: [['sltui', 'sltui'], ['sgtui', 'sgtui'], ['sleui', 'sleui'], ['sgeui', 'sgeui'], ['sequi', 'sequi'], ['sneui', 'sneui']]},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'},
            {type: 'field_image', name: 'format', src: 'img/change.svg', width: 20, height: 20},
            {type: 'field_input', name: 'immediate'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'func Rd, Rs, immediate\nPerform logical operation func on register Rs and the immediate. Set Rd to 1 if true, 0 otherwise.',
        extensions: ['generalRegisterValidator', 'immediateValidator']
    },
    {   type: 'moveGeneralToSpecial',
        style: 'specialBlocks',
        message0: '%1 %2, %3',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'movgs'},
            {type: 'field_input', name: 'specialRegister', text: '$_'},
            {type: 'field_input', name: 'register2', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'movgs Rd, Rs\nMove the conents of general register Rs into special register Rd',
        extensions: ['generalRegisterValidator', 'specialRegisterValidator']
    },
    {   type: 'moveSpecialToGeneral',
        style: 'specialBlocks',
        message0: '%1 %2, %3',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'movsg'},
            {type: 'field_input', name: 'register1', text: '$_'},
            {type: 'field_input', name: 'specialRegister', text: '$_'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'movgs Rd, Rs\nMove the conents of special register Rs into general register Rd',
        extensions: ['generalRegisterValidator', 'specialRegisterValidator']
    },
    {   type: 'break',
        style: 'specialBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'break'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Generate a break point exception'
    },
    {   type: 'syscall',
        style: 'specialBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'syscall'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Generate a syscall exception'
    },
    {   type: 'returnFromException',
        style: 'specialBlocks',
        message0: '%1',
        args0:
        [
            {type: 'field_label_serializable', name: 'instruction', text: 'rfe'}
        ],
        previousStatement: null,
        nextStatement: null,
        tooltip: 'Execute a Return from Exception (rfe)'
    }
]);

Blockly.Extensions.register('labelValidator',
    function()
    {
        const regexPattern = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;

        field = this.getField('label');

        field.setValidator(function(newValue) {
            return regexPattern.test(newValue) ? newValue : null;
        });
    }
);

Blockly.Extensions.register('generalRegisterValidator',
    function()
    {
        const regExPattern = /^\$([0-9]|1[0-5]|ra|sp)$/;

        if ((field = this.getField('register')) != null)
        {
            field.setValidator(function(newValue) {
                return regExPattern.test(newValue) ? newValue : null
            });
        }

        if ((field = this.getField('register1')) != null)
        {
            field.setValidator(function(newValue) {
                return regExPattern.test(newValue) ? newValue : null
            })
        }

        if ((field = this.getField('register2')) != null)
        {
            field.setValidator(function(newValue) {
                return regExPattern.test(newValue) ? newValue : null
            });
        }

        if ((field = this.getField('register3')) != null)
        {
            field.setValidator(function(newValue) {
                return regExPattern.test(newValue) ? newValue : null
            });
        }
    }
);

Blockly.Extensions.register('specialRegisterValidator',
    function()
    {
        const regexPattern = /^\$(cctrl|estat|icount|ccount|evec|ear|ers|ptable|rbase)$/;

        field = this.getField('specialRegister');

        field.setValidator(function(newValue) {
            return regexPattern.test(newValue) ? newValue : null
        });
    }
)

Blockly.Extensions.register('immediateValidator',
    function()
    {
        const block = this;
        this.fieldImage = block.getField('format');
        block.fieldImmediate = block.getField('immediate');

        const generalRegexPattern = /^(-?(6[0-5]{2}[0-3][0-5]|[1-5][0-9]{4}|[1-9][0-9]{0,3}|0)|0x[0-9a-fA-F]{1,4}|0b[0-1]{1,16}|\'([ -~]|\\a|\\n|\\r)\')$/;
        const decimalRegexPattern = /^-?(6[0-5]{2}[0-3][0-5]|[1-5][0-9]{4}|[1-9][0-9]{0,3}|0)$/;
        const hexRegexPattern = /^0x[0-9a-fA-F]{1,4}$/;
        const binaryRegexPattern = /^0b[0-1]{1,16}$/;
        const charRegexPattern = /^\'([ -~]|\\a|\\n|\\r)\'$/;

        block.fieldImmediate.setValidator(function(newValue) {
            return generalRegexPattern.test(newValue) ? newValue : null;
        });

        block.fieldImage.setOnClickHandler(function(image)
        {
            //0: Decimal, 1: Hex, 2: Binary, 3: Char
            value = block.fieldImmediate.getText();
            if (decimalRegexPattern.test(value)) block.format = 0;
            if (hexRegexPattern.test(value)) block.format = 1;
            if (binaryRegexPattern.test(value)) block.format = 2;
            if (charRegexPattern.test(value)) block.format = 3;

            block.format = (block.format + 1) % 4;
            switch (block.format)
            {
                case 0:
                    switch (value)
                    {
                        case '\'\\a\'':
                            block.fieldImmediate.setValue(7);
                            break;
                        case '\'\\n\'':
                            block.fieldImmediate.setValue(10);
                            break;
                        case '\'\\r\'':
                            block.fieldImmediate.setValue(13);
                            break;
                        default:
                            block.fieldImmediate.setValue(value.charCodeAt(1));
                            break;
                    }
                    break;
                case 1:
                    value = (parseInt(value) >>> 0).toString(16).toUpperCase();
                    if (value.length > 4) value = value.substring(4)
                    block.fieldImmediate.setValue(`0x${value}`);
                    break;
                case 2:
                    block.fieldImmediate.setValue(`0b${parseInt(value).toString(2)}`);
                    break;
                case 3:
                    value = window.getSignedInt(value.replace("0b", "").padStart(16, '0'), 'blockly');
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
                        block.fieldImmediate.setValue(string);
                    }
                    else
                    {
                        block.fieldImmediate.setValue(value);
                    }
                    break;
            }
        });
    }
);

Blockly.common.defineBlocks(definitions);

const supportedEvents = new Set
([
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
    Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE
]);

var dotNetReference = null;

window.setDotNetRef = (dotnetRef) =>
{
    dotNetReference = dotnetRef;
}

let prevEvents = null;
let workspaceJSON = null;

function updateCode(event)
{
    if (workspace.isDragging()) return;
    if (!supportedEvents.has(event.type)) return;

    const codeArea = document.getElementById('wsimCode');
    const highlightRegex = /highlightBlock\('[^']+'\)\n/g;
    const tabRegex = /\t(.text|.global main|.bss|.data|LABEL)/g;
    code = generateCode();

    //Remove all backend elements not meant to be seen by the user
    formattedCode = code.replace(highlightRegex, "");
    formattedCode = formattedCode.replace(tabRegex, "$1");
    formattedCode = formattedCode.replaceAll("LABEL", "");
    //Translate all special characters to their HTML equivalents
    formattedCode = formattedCode.replaceAll("\n", "<br>");
    formattedCode = formattedCode.replaceAll("\t", "&emsp;")
    codeArea.innerHTML = formattedCode;

    //Flag code as unsaved (if there is code present, and it's not the code provided by the level)
    code !== '' && presetCode != code ? window.codeSaved = false : window.codeSaved = true;

    //Trigger a popover informing the user that their Blockly code isn't synced with what's running in WRAMP
    if (code !== '' && compiledCode != undefined && code != compiledCode) {
        window.triggerPopover('Code has been changed, compile first.');
    }
    else //Hide the popover if the code space is empty
    {
        document.querySelectorAll('.popover').forEach(popoverElement => {
        if (popoverElement.innerHTML.includes('Code has been changed, compile first.'))
            {
                popoverElement.remove();
            }
        });
    }

    //Ignore multiple events generated by one action (e.g. the user creating a block and it attaching to other blocks as it's placed)
    if (event.group === prevEvents && event.type != Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE) return;
    prevEvents = event.group;

    //Save the current workspace to local storage, only if there is user made code
    workspaceJSON = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
    if (workspaceJSON != "{}" && presetCode != code)
    {
        localStorage.setItem(blocklyStorage, workspaceJSON);
    }
    else
    {
        localStorage.removeItem(blocklyStorage);
    }

    if (dotNetReference != null)
    {
        dotNetReference.invokeMethodAsync('InvokeBoardChanged');
    }
}

window.initUpdate = () => {
    workspace.addChangeListener(updateCode);
}

window.getGeneratedCode = () =>
{
    return document.getElementById('wsimCode').innerHTML.replaceAll('<br>', '\n');
}

window.saveWorkspace = () =>
{
    let domains = window.location.pathname.split('/');
    let levelID = domains[domains.length - 1];
    window.saveFile(workspaceJSON, levelID === '' ? 'sandboxWorkspace.json' : `${levelID}Workspace.json`);
}

window.loadWorkspace = (workspaceJSON) =>
{
    Blockly.serialization.workspaces.load(JSON.parse(workspaceJSON), workspace);
    updateCode(Blockly.Events.BLOCK_CREATE);
}

window.loadPresetWorkspace = (workspaceJSON) =>
{
    presetWorkspace = workspaceJSON;
    loadWorkspace(workspaceJSON);
    presetCode = generateCode();
    localStorage.removeItem(blocklyStorage);
}

window.setBlocklyStorageKey = (storageKey) =>
{
    blocklyStorage = storageKey;
}

window.loadSavedOrPresetWorkspace = (storageKey, workspaceJSON) =>
{
    if (storageKey != null)
    {
        blocklyStorage = storageKey;
    }

    presetWorkspace = workspaceJSON;

    // Keep presetCode anchored to the starter workspace so reset/save logic remains correct.
    let presetCodeWorkspace = new Blockly.Workspace();
    Blockly.serialization.workspaces.load(JSON.parse(workspaceJSON), presetCodeWorkspace);
    presetCode = wrampGenerator.workspaceToCode(presetCodeWorkspace);
    presetCodeWorkspace.dispose();

    let savedWorkspace = localStorage.getItem(blocklyStorage);
    if (savedWorkspace != null)
    {
        loadWorkspace(savedWorkspace);
    }
    else
    {
        loadWorkspace(workspaceJSON);
    }
}

window.updateToolbox = (toolbox) =>
{
    workspace.updateToolbox(JSON.parse(toolbox));
}

window.resetWorkspace = () =>
{
    if (confirm('Do you want to clear your workspace?') == true)
    {
        if (presetWorkspace != null)
        {
            loadWorkspace(presetWorkspace);
        }
        else
        {
            workspace.clear();
        }
        window.clearPopovers();
    }
}

window.resetUI = () =>
{
    Blockly.hideChaff();
}

window.switchBlocklyTheme = (themeName) =>
{
    if (themeName == 'light')
    {
        workspace.setTheme(lightModeTheme);
    }
    else if (themeName == 'dark')
    {
        workspace.setTheme(darkModeTheme);
    }
}

window.initBlocklyTheme = () =>
{
    const themeType = localStorage.getItem('theme');
    if (themeType != '')
    {
        switchBlocklyTheme(themeType);
    }
}