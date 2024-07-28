const edata = [
    {
      "date": "24 March,2023",
      "type": "Key Points",
      "content": "My name is bilal flex flex-wrap mt-4 w-full pr-4 cursor-pointeritems-center.......",
      "keywords": ["Imran","Khan", 'Pakistan']
    },
    {
      "date": "21 March,2023",
      "type": "Paragraph",
      "content": "My name is bilal flex flex-wrap mt-4 w-full pr-4 cursor-pointeritems-center.......",
      "keywords": ["noob","haider", 'bilal']
    }
  ];
  
  const data = [
    { keywords: ['apple', 'banana'], content: 'This is the first sentence.', id: 1 },
    { keywords: ['apple', 'pear'], content: 'This is the second sentence.',id: 2 },
    { keywords: ['orange', 'pear'], content: 'This is the third sentence.', id: 3 }
  ];
  
  // const wordToSearch = 'khan';
  
  // const result = edata.filter(item => {
  //   const mergedString = item.keywords.join(' ') + ' ' + item.content;
  //   return mergedString.toLowerCase().includes(wordToSearch.toLowerCase());
  // });
  
  // console.log(result);

  function deleteElementById( id) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1);
        break; 
      }
    }
  }
deleteElementById(4)
  console.log(data)