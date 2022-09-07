import Link from 'next/link';
import useSWR from 'swr';
import { Item } from '../types/types';
import React, { useState } from 'react';
import { Layout } from '../component/layout';
import styles from '../component/items.module.css';
import { arrayBuffer } from 'stream/consumers';

export const fetcher: (args: string) => Promise<any> = (...args) =>
  fetch(...args).then((res) => res.json());

export default function Items() {
  // 並び替え用のstate
  const [sortSelect, setSortSelect] = useState('up');
  const onChangeSortSelect = (event: any) =>
    setSortSelect(event.target.value);
  console.log(sortSelect);

  // selectが昇順と降順でfetchするdataを変更する
  let get = '';
  if (sortSelect === 'up') {
    get = 'http://localhost:8000/items?_sort=price&_order=asc';
  } else if (sortSelect === 'down') {
    get = 'http://localhost:8000/items?_sort=price&_order=desc';
  }

  const { data, error } = useSWR(get, fetcher);

  // 検索欄に文字入力できるようにする
  const [nameText, setNameText] = useState('');
  const onChangeNameText = (event: any) =>
    setNameText(event.target.value);

  // 検索欄に入力された文字を含む商品だけをsetSearchDataに代入
  const [searchData, setSearchData]: any[] = useState([]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  // nameTextに書かれた物と一致する名前のdataをfilterで抽出する関数
  // 抽出したdataをsetSearchDataに保管
  const onClickSearch = () => {
    setSearchData(
      data.filter((e: any) => {
        return e.name.indexOf(nameText) >= 0;
      })
    );
  };

  // クリアボタンを押した時setNameTextを空で返す
  const formReset = () => {
    setNameText('');
    setSearchData([]);
  };

  return (
    <Layout show={true}>
      <div className={styles.searchWrapper}>
        <p>
          <span className={styles.serchTitle}>商品を検索する</span>
        </p>
        <div>
          <form
            name="form1"
            method="post"
            action="#"
            className={styles.searchForm}
          >
            <label htmlFor="name">商品名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={nameText}
              placeholder={'search'}
              onChange={onChangeNameText}
              className={styles.searchNameInput}
            ></input>

            <select
              name="sort"
              size={1}
              className={styles.select}
              value={sortSelect}
              onChange={onChangeSortSelect}
            >
              <option value="up">価格[安い順]</option>
              <option value="down">価格[高い順]</option>
            </select>

            <br />

            <button
              type="button"
              value="検索"
              className={styles.searchBtn}
              onClick={() => {
                onClickSearch();
              }}
            >
              検索
            </button>

            <button
              type="reset"
              value="クリア"
              className={styles.cannselBtn}
              onClick={() => formReset()}
            >
              クリア
            </button>
          </form>
        </div>
      </div>

      <div className={styles.itemWrapper}>
        {/* 条件分岐 */}
        {nameText == '' ? (
          // 「？」はtrue、「:」はfalse
          // 検索テキストが空の場合
          data.map((item: Item) => {
            const { id, name, price, imagePath } = item;
            return (
              <div key={id}>
                <table className={styles.item}>
                  <tr>
                    <th>
                      <img
                        src={imagePath}
                        className={styles.itemImg}
                        width={300}
                      />
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <Link href={`/posts/${id}`}>
                        <a className={styles.name}>{name}</a>
                      </Link>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <p>
                        {String(price).replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )}
                        円（税抜）
                      </p>
                    </th>
                  </tr>
                </table>
              </div>
            );
          })
        ) : // 検索テキストに入力した場合
        searchData.length == 0 ? (
          <p className={styles.p}>該当する商品がありません。</p>
        ) : (
          searchData.map((item: Item) => {
            const { id, name, price, imagePath } = item;
            return (
              <div key={id}>
                <table className={styles.item}>
                  <tr>
                    <th>
                      <img
                        src={imagePath}
                        width={300}
                        className={styles.itemImg}
                      />
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <Link href={`/posts/${id}`}>
                        <a className={styles.name}>{name}</a>
                      </Link>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <p className="price">
                        {String(price).replace(
                          /(\d)(?=(\d\d\d)+(?!\d))/g,
                          '$1,'
                        )}
                        円（税抜）
                      </p>
                    </th>
                  </tr>
                </table>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
