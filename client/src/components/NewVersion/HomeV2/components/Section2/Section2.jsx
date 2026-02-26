import { useTranslation } from "react-i18next";

export const Section2 = () => {
  const { t } = useTranslation();

  return (
    <div className="section2ContainerV2 containerV2">
      <div className="starOutside">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 14.9893C24.1155 15.5239 20.7347 16.0157 18.6591 17.6408C16.2197 19.5438 15.6419 23.0292 15 30C14.3367 22.7726 13.7375 19.3086 11.0628 17.4483C8.98716 15.9943 5.62767 15.5239 0 15.0107C5.86305 14.4761 9.26534 13.9843 11.3195 12.3806C13.7803 10.4562 14.3581 6.99216 15 0C15.5991 6.43621 16.1341 9.87883 18.1241 11.8674C20.1141 13.856 23.5806 14.412 30 14.9893Z"
            fill="#F4E096"
          />
        </svg>
      </div>

      <div className="starOutside1">
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.3"
            d="M42 20.985C33.7618 21.7334 29.0285 22.422 26.1227 24.6971C22.7076 27.3614 21.8987 32.2409 21 42C20.0713 31.8817 19.2325 27.0321 15.4879 24.4277C12.582 22.392 7.87874 21.7334 0 21.015C8.20827 20.2666 12.9715 19.578 15.8474 17.3329C19.2924 14.6386 20.1013 9.78902 21 0C21.8388 9.01069 22.5877 13.8304 25.3738 16.6144C28.1598 19.3984 33.0128 20.1768 42 20.985Z"
            fill="#F4E096"
          />
        </svg>
      </div>

      <div className="left">
        <div className="icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.3494 29.4059C39.9381 28.851 41.6477 28.549 43.4287 28.549C45.1745 28.549 46.8517 28.8391 48.4137 29.3733M18.9766 36.2903C18.2602 36.1513 17.5197 36.0784 16.7621 36.0784C10.4502 36.0784 5.3335 41.135 5.3335 47.3726C5.3335 53.6101 10.4502 58.6667 16.7621 58.6667H43.4287C51.8445 58.6667 58.6668 51.9246 58.6668 43.6078C58.6668 37.0163 54.3814 31.414 48.4137 29.3733M18.9766 36.2903C18.3657 34.6608 18.0319 32.8983 18.0319 31.0588C18.0319 22.7421 24.8542 16 33.27 16C41.1092 16 47.5658 21.8499 48.4137 29.3733M18.9766 36.2903C20.4817 36.5824 21.8809 37.1664 23.1113 37.9803"
              stroke="#f4e096"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M21.3333 12C16.1787 12 12 16.1787 12 21.3333C12 25.0565 14.1801 28.2705 17.3333 29.7685M21.3333 12C23.3163 12 25.1549 12.6184 26.6667 13.6729M21.3333 12C19.3503 12 17.5118 12.6184 16 13.6729M21.3333 12C23.8764 12 26.1819 13.0171 27.8653 14.6667M21.3333 12C18.7903 12 16.4847 13.0171 14.8014 14.6667M21.3333 12C24.7284 12 27.7001 13.8128 29.3333 16.5232"
              stroke="#f4e096"
              stroke-width="2"
            />
            <path
              d="M20 5.33325V6.66659"
              stroke="#f4e096"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M6.6665 20L5.33317 20"
              stroke="#f4e096"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M30.3696 9.62952L29.7935 10.2057"
              stroke="#f4e096"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M10.2058 29.7947L9.62965 30.3708"
              stroke="#f4e096"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M10.2058 10.2053L9.62965 9.62916"
              stroke="#f4e096"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div className="textContent">
          <div>{t("section2.t1")}</div>
          <div>{t("section2.t2")}</div>
        </div>
        <div className="searchContent">
          <i class="fa-solid fa-magnifying-glass"></i>
          <div className="textInside">{t("section2.t3")}</div>
        </div>
      </div>

      <div className="right">
        <div className="item">
          <div>{t("section2.t4")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>
        <div className="item">
          <div>{t("section2.t5")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>
        <div className="item">
          <div>{t("section2.t6")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>
        <div className="item">
          <div>{t("section2.t7")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>

        <div className="star1">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.4"
              d="M22 10.9922C17.6847 11.3842 15.2054 11.7448 13.6833 12.9366C11.8944 14.3321 11.4708 16.8881 11 22C10.5136 16.6999 10.0742 14.1597 8.1127 12.7954C6.59059 11.7292 4.12696 11.3842 0 11.0078C4.29957 10.6158 6.79458 10.2552 8.301 9.07912C10.1056 7.66785 10.5292 5.12758 11 0C11.4394 4.71989 11.8317 7.24448 13.291 8.70278C14.7504 10.1611 17.2924 10.5688 22 10.9922Z"
              fill="#F4E096"
            />
          </svg>
        </div>

        <div className="star">
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42 20.985C33.7618 21.7334 29.0285 22.422 26.1227 24.6971C22.7076 27.3614 21.8987 32.2409 21 42C20.0713 31.8817 19.2325 27.0321 15.4879 24.4277C12.582 22.392 7.87874 21.7334 0 21.015C8.20827 20.2666 12.9715 19.578 15.8474 17.3329C19.2924 14.6386 20.1013 9.78902 21 0C21.8388 9.01069 22.5877 13.8304 25.3738 16.6144C28.1598 19.3984 33.0128 20.1768 42 20.985Z"
              fill="#F4E096"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
