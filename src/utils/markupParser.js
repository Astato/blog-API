function keyGen() {
  return (Math.random() * (999999 - 1) + 1).toFixed();
}

function processTextarea(data) {
  const elementArray = [];

  function parseData(Tag, color, size, text, link) {
    let element;

    if (Tag === "img") {
      element = (
        <Tag
          key={keyGen()}
          src={text}
          alt="image"
          style={{ width: size + "px", maxWidth: "100%" }}
        />
      );
      elementArray.push(element);
    } else if (Tag === "a") {
      console.log(link, text);
      element = (
        <Tag
          key={keyGen()}
          href={link}
          target="_blank"
          style={{ color: color, fontSize: size + "px" }}
        >
          {text}
        </Tag>
      );
      elementArray.push(element);
    } else if (Tag === "ol" || Tag === "ul") {
      const regex = /\n([^\n]+)/g;
      const linkPattern =
        /\*K\s+color=(\w+),\s+size=\s*(\d+),\s+link=(\S+)\*([\s\S]+?)\*K\*/;

      const itemsList = text.match(regex);
      const itemsArray = itemsList.map((string) => {
        string = string.replace(">", "").trim();
        if (string.match(linkPattern)) {
          const match = string.match(linkPattern);
          return (
            <li>
              <a
                style={{ color: match[1], size: match[2] + "px" }}
                href={match[3]}
              >
                {match[4]}
              </a>
            </li>
          );
        }
        return <li key={keyGen()}>{string}</li>;
      });
      element = (
        <Tag key={keyGen()} style={{ color: color, fontSize: size + "px" }}>
          {itemsArray}
        </Tag>
      );
      elementArray.push(element);
    } else {
      element = (
        <Tag key={keyGen()} style={{ color: color, fontSize: size + "px" }}>
          {text}
        </Tag>
      );
      elementArray.push(element);
    }
  }
  const pattern =
    /(\*([TSNLitKI])\s+(?:color=(\w+),\s+)?size=\s*(\d+)(?:\s*,\s*link=(\S+))?(\s+)?\*([\s\S]+?)\*\2\*)/g;

  let match;
  while ((match = pattern.exec(data)) !== null) {
    let tagName = match[2]; // Extracted tag name (T, t, N, L, S, etc.)
    const color = match[3]; // Extracted coloR attribute
    const size = match[4]; // Extracted size attribute
    const link = match[5]; // Extracted Link attribute
    const text = match[7]; // Extracted text between asterisks

    switch (tagName) {
      case "T":
        tagName = "h1";
        break;
      case "S":
        tagName = "h2";
        break;
      case "N":
        tagName = "ol";
        break;
      case "L":
        tagName = "ul";
        break;
      case "i":
        tagName = "span";
        break;
      case "t":
        tagName = "p";
        break;
      case "K":
        tagName = "a";
        break;
      case "I":
        tagName = "img";
        break;
    }
    parseData(tagName, color, size, text, link);
  }
  return elementArray;
}

export default processTextarea;
