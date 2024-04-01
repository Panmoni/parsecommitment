function parseCommitment(bytecode, commitment) {
  const stack = [];
  const altStack = [];

  // Helper function to push a value to the stack
  const push = (value) => stack.push(value);

  // Helper function to pop a value from the stack
  const pop = () => stack.pop();

  // Helper function to convert hex to Unicode
  const hexToUnicode = (hex) => {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  };

  // Loop through each opcode in the bytecode
  for (let i = 0; i < bytecode.length; i += 2) {
    const opcode = bytecode.substr(i, 2);

    switch (opcode) {
      case "00": // OP_0
        push("");
        break;
      case "52": // OP_2
        push(2);
        break;
      case "58": // OP_8
        push(8);
        break;
      case "5c": // OP_12
        push(12);
        break;
      case "6b": // OP_TOALTSTACK
        altStack.push(pop().toString(16).padStart(2, "0"));
        break;
      case "67": // OP_ELSE
        // Skip to matching OP_ENDIF
        let depth = 1;
        while (depth > 0) {
          i += 2;
          if (bytecode.substr(i, 2) === "68") depth--; // OP_ENDIF
          if (bytecode.substr(i, 2) === "63") depth++; // OP_IF
        }
        break;
      case "68": // OP_ENDIF
        break;
      case "75": // OP_DROP
        pop();
        break;
      case "78": // OP_OVER
        if (stack.length >= 2) {
          const item = stack[stack.length - 2];
          push(item);
        }
        break;
      case "7f": // OP_SPLIT
        const splitPosition = pop();
        const data = pop();
        const left = data.slice(0, splitPosition * 2);
        const right = data.slice(splitPosition * 2);
        push(left);
        push(right);
        break;
      case "87": // OP_EQUAL
        const [a, b] = [pop(), pop()];
        push(a === b ? 1 : 0);
        break;
      case "cf": // OP_UTXOTOKENCOMMITMENT
        push(commitment);
        break;
      case "02": // Pushes next 2 bytes to stack
        const value = bytecode.substr(i + 2, 4);
        push(value);
        i += 4;
        break;
      case "63": // OP_IF
        if (pop() === 0) {
          // Skip to matching OP_ELSE or OP_ENDIF
          let depth = 1;
          while (depth > 0) {
            i += 2;
            if (bytecode.substr(i, 2) === "67") depth--; // OP_ELSE
            if (bytecode.substr(i, 2) === "68") depth--; // OP_ENDIF
            if (bytecode.substr(i, 2) === "63") depth++; // OP_IF
          }
        }
        break;
      default:
        throw new Error(`Unknown opcode: ${opcode}`);
    }
  }

  // Convert hex values in altStack to Unicode and return
  return altStack.map(hexToUnicode);
}

module.exports = parseCommitment;
