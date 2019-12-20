// key maps
/*MOVE_LEFT = { 
	key: 65, // keycode, remappable 
	map: "A", // maps the character when key is remapped
	bitmask: 1 // constant, network bitmask in this case used for netobject input state
}*/
// input state keys
InputController.MOVE_LEFT = {key: 65, map: "A", bitmask: 1};
InputController.MOVE_RIGHT = {key: 68, map: "D", bitmask: 2};
InputController.MOVE_FORWARD = {key: 87, map: "W", bitmask: 4};
InputController.MOVE_BACKWARD = {key: 83, map: "S", bitmask: 8};


// ui 
InputController.TOGGLE_CONSOLE = {key: 9, map: "TAB"};
InputController.TOGGLE_CHAT = {key: 9, map: "TAB"};



// more debugs
InputController.TEST_MOBILE = {key: 32, map: "SPACE"};




// a lot of these are wrong but still useful for certain instances
InputController.MOUSE_LEFT = 0;
InputController.MOUSE_MIDDLE = 1;
InputController.MOUSE_RIGHT = 2;
InputController.MOUSE_EX1 = 3;
InputController.MOUSE_EX2 = 4;
InputController.MOUSE_EX3 = 5;
InputController.MOUSE_EX4 = 6;
InputController.MOUSE_EX5 = 7;

InputController.KEY_BACKSPACE = 8;
InputController.KEY_TAB = 9;
InputController.KEY_ENTER = 13;
InputController.KEY_SHIFT = 16;
InputController.KEY_CTRL = 17;
InputController.KEY_ALT = 18;
InputController.KEY_PAUSE = 19;
InputController.KEY_CAPSLOCK = 20;
InputController.KEY_ESCAPE = 27;
InputController.KEY_SPACE = 32;
InputController.KEY_PAGEUP = 33;
InputController.KEY_PAGEDOWN = 34;
InputController.KEY_END = 35;
InputController.KEY_HOME = 36;

InputController.KEY_ARROW_LEFT = 37;
InputController.KEY_ARROW_UP = 38;
InputController.KEY_ARROW_RIGHT = 39;
InputController.KEY_ARROW_DOWN = 40;

InputController.KEY_INSERT = 45;
InputController.KEY_DELETE = 46;

InputController.KEY_0 = 48;
InputController.KEY_1 = 49;
InputController.KEY_2 = 50;
InputController.KEY_3 = 51;
InputController.KEY_4 = 52;
InputController.KEY_5 = 53;
InputController.KEY_6 = 54;
InputController.KEY_7 = 55;
InputController.KEY_8 = 56;
InputController.KEY_9 = 57;

InputController.KEY_A = 65;
InputController.KEY_B = 66;
InputController.KEY_C = 67;
InputController.KEY_D = 68;
InputController.KEY_E = 69;
InputController.KEY_F = 70;
InputController.KEY_G = 71;
InputController.KEY_H = 72;
InputController.KEY_I = 73;
InputController.KEY_J = 74;
InputController.KEY_K = 75;
InputController.KEY_L = 76;
InputController.KEY_M = 77;
InputController.KEY_N = 78;
InputController.KEY_O = 79;
InputController.KEY_P = 80;
InputController.KEY_Q = 81;
InputController.KEY_R = 82;
InputController.KEY_S = 83;
InputController.KEY_T = 84;
InputController.KEY_U = 85;
InputController.KEY_V = 86;
InputController.KEY_W = 87;
InputController.KEY_X = 88;
InputController.KEY_Y = 89;
InputController.KEY_Z = 90;

InputController.KEY_LWINDOWKEY = 91;
InputController.KEY_RWINDOWKEY = 92;
InputController.KEY_SELECT = 93;

InputController.KEY_NUMPAD_0 = 96;
InputController.KEY_NUMPAD_1 = 97;
InputController.KEY_NUMPAD_2 = 98;
InputController.KEY_NUMPAD_3 = 99;
InputController.KEY_NUMPAD_4 = 100;
InputController.KEY_NUMPAD_5 = 101;
InputController.KEY_NUMPAD_6 = 102;
InputController.KEY_NUMPAD_7 = 103;
InputController.KEY_NUMPAD_8 = 104;
InputController.KEY_NUMPAD_9 = 105;

InputController.KEY_MULTIPLY = 106;
InputController.KEY_ADD = 107;
InputController.KEY_SUBTRACT = 109;
InputController.KEY_DECIMAL = 110;
InputController.KEY_DIVIDE = 111;

InputController.KEY_F1 = 112;
InputController.KEY_F2 = 113;
InputController.KEY_F3 = 114;
InputController.KEY_F4 = 115;
InputController.KEY_F5 = 116;
InputController.KEY_F6 = 117;
InputController.KEY_F7 = 118;
InputController.KEY_F8 = 119;
InputController.KEY_F9 = 120;
InputController.KEY_F10 = 121;
InputController.KEY_F11 = 122;
InputController.KEY_F12 = 123;

InputController.KEY_NUMLOCK = 144;
InputController.KEY_SCROLLOCK = 145;
InputController.KEY_SEMICOLON = 186;
InputController.KEY_EQUAL = 187;
InputController.KEY_COMMA = 188;
InputController.KEY_DASH = 189;
InputController.KEY_PERIOD = 190;
InputController.KEY_FORWARDSLASH = 191;
InputController.KEY_GRAVE = 192;
InputController.KEY_OPENBRACKET = 219;
InputController.KEY_BACKSLASH = 220;
InputController.KEY_CLOSEBRACKET = 221;
InputController.KEY_QUOTE = 222;