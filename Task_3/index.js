const getInput = async () => {
  try {
    const response = await fetch(
      "https://share.shub.edu.vn/api/intern-test/input",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Có lỗi xảy ra khi gọi API");
    }

    dataInput = await response.json();
    return dataInput;
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
};

const solution = (data, query) => {
  let array1 = [];
  let array2 = [];
  array1.push(data[0]);
  array2.push(data[0]);
  for (let i = 1; i < data.length; i++) {
    array1.push(data[i] + array1[i - 1]);
  }
  for (let i = 1; i < data.length; i++) {
    if (i % 2 == 0) {
      array2.push(array2[i - 1] + data[i]);
    } else {
      array2.push(array2[i - 1] - data[i]);
    }
  }
  let result = [];
  for (let q in query) {
    let [firstNum, secondNum] = query[q].range;
    if (firstNum < 0) firstNum = 0;
    if (secondNum >= data.length) secondNum = data.length - 1;
    if (firstNum > secondNum) {
      [firstNum, secondNum] = [secondNum, firstNum];
    }
    if (query[q].type === "1") {
      if (firstNum === 0) result.push(array1[secondNum]);
      else result.push(array1[secondNum] - array1[firstNum - 1]);
    } else {
      if (firstNum % 2 !== 0) {
        result.push(-(array2[secondNum] - array2[firstNum - 1]));
      } else {
        if (firstNum === 0) {
          result.push(array2[secondNum]);
        } else result.push(array2[secondNum] - array2[firstNum - 1]);
      }
    }
  }
  return result;
};

const postResult = async (token, result) => {
  try {
    const response = await fetch(
      "https://share.shub.edu.vn/api/intern-test/output",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Lỗi:", error.message);
    // Xử lý lỗi tại đây nếu cần
    return { error: error.message };
  }
};

const main = async () => {
  let input = await getInput();

  let { token, data, query } = input;
  let result = solution(data, query);
  postResult(token, result);
};
main();
