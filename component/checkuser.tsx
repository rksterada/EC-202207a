import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CheckUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const [day, setDay] = useState('');
  const router = useRouter();

  const onClickCheck = () => {
    fetch('http://localhost:8000/users')
      .then((res) => res.json())
      .then((data) => {
        if (
          !(
            (
              day &&
              name &&
              email.match(
                /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
              ) && //メールアドレスが正規表現と一致するか
              zipcode.match(/^\d{3}-\d{4}$/) && //郵便番号が正規表現と一致するか
              address &&
              tel.match(/^(0[5-9]0-[0-9]{4}-[0-9]{4})$/)
            ) //電話番号が正規表現と一致するか。
          )
        ) {
          alert('すべての全ての項目を正しく入力してください');
        } else {
          router.push('/'); //登録内容が正しい場合、ボタンを押すと、ホーム画面に遷移。
          return fetch('http://localhost:8000/users', {
            //全ての入力が正しかった場合、db.jsonのusersに値を追加。
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              name: name,
              email: email,
              zipcode: zipcode,
              address: address,
              tel: tel,
              day: day,
            }),
          });
        }
      });
  };

  return (
    <fieldset>
      <p>お届け先情報</p>
      <form action="post">
        <table>
          <tr>
            <td>
              <label htmlFor="name">お名前：</label>
              {name.length < 1 && (
                <span>名前を入力してください</span>
              )}{' '}
              {/*入力されてない時だけ"名前を入力してください”を表示 以下全てのinputに同様の機能追加*/}
            </td>
            <td>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                placeholder="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="email">メールアドレス:</label>
              {email.length < 1 && (
                <span>メールアドレスを入力してください</span>
              )}
              {!email.match(
                /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
              ) &&
                email.length >= 1 && (
                  <span>メールアドレスの形式が不正です</span>
                )}
            </td>
            <td>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="zipcode">郵便番号:</label>
              {zipcode.length < 1 && (
                <span>郵便番号を入力してください</span>
              )}
              {!zipcode.match(/^\d{3}-\d{4}$/) &&
                zipcode.length >= 1 && (
                  <span>
                    郵便番号はXXX-XXXXの形式で入力してください
                  </span>
                )}
            </td>
            <td>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={zipcode}
                placeholder="Zipcode"
                onChange={(e) => {
                  setZipcode(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="address">住所：</label>
              {address.length < 1 && (
                <span>住所を入力してください</span>
              )}
            </td>
            <td>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                placeholder="Address"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="tel">電話番号:</label>
              {tel.length === 0 && (
                <span>電話を入力してください</span>
              )}
              {!tel.match(/^(0[5-9]0-[0-9]{4}-[0-9]{4})$/) &&
                tel.length >= 1 && (
                  <span>
                    電話番号はXXX-XXXX-XXXXの形式で入力してください
                  </span>
                )}
            </td>
            <td>
              <input
                type="tel"
                id="tel"
                name="tel"
                value={tel}
                placeholder="PhoneNumber"
                onChange={(e) => {
                  setTel(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <label htmlFor="day">配達日時</label>
            </td>
            <td>
              <input
                type="datetime-local"
                name="day"
                value={day}
                onChange={(e) => {
                  setDay(e.target.value);
                }}
              />
            </td>
          </tr>
        </table>

        <div>
          <p>お支払い方法</p>
          <input type="radio" name="money" />
          <label htmlFor="money">代金引換</label>

          <input type="radio" name="credit" />
          <label htmlFor="credit">クレジットカード決済</label>
        </div>
      </form>
    </fieldset>
  );
}

// 支払いのvalue設定できていない
// css
// ボタンどうするか
