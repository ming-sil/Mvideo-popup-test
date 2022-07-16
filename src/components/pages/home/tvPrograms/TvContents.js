import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Scrollbar } from "swiper";
import "swiper/css/scrollbar";
import { imgUrl } from "../../../constant/constant";

import { Loading } from "../../../Loading";
import { useEffect, useState } from "react";
import { contentsApi } from "../../../../api";
import { DetailPopup } from "../detail/DetailPopup";
import { mainStyle } from "../../../../styles/GlobalStyle";

const Wrap = styled.div`
  padding-left: 100px;
  margin: 15px 0;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 90px;
`;

const Con = styled.div`
  cursor: pointer;

  margin-bottom: 20px;
  &:hover {
    img {
      width: 110%;
    }
  }
`;

const Poster = styled.div`
  width: 100%;
  height: 18vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    width: 100%;
    transition: 0.3s;
  }
`;

const Name = styled.h3`
  font-size: 15px;
  font-weight: 100;
  margin: 5px 0;
`;

const Popup = styled.div`
  display: ${(props) => props.setPopup};
`;
const ExitBtn = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 30px;
  right: 30px;
  cursor: pointer;
  z-index: 999;
  svg {
    transition: 0.3s;
    fill: ${mainStyle.mainColor};
  }
  &:hover {
    svg {
      fill: ${mainStyle.highlightColor};
    }
  }
`;

export const TvContents = ({ tvData, contentsClass }) => {
  const [mDetail, setMDetail] = useState();
  const [tvDetail, setTvDetail] = useState();
  const [mTrailer, setMTrailer] = useState();
  const [tvTrailer, setTvTrailer] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detailData = async () => {
      try {
        //영화
        const { data: mDetail } = await contentsApi.mDetail(92782);
        setMDetail(mDetail);
        const {
          data: { results: mTrailer },
        } = await contentsApi.mVideo(92782);
        setMTrailer(mTrailer.length === 0 ? null : mTrailer[0].key);

        //tv
        const { data: tvDetail } = await contentsApi.tvDetail(92782);
        setTvDetail(tvDetail);
        const {
          data: { results: tvTrailer },
        } = await contentsApi.tvVideo(92782);
        setTvTrailer(tvTrailer.length === 0 ? null : tvTrailer[0].key);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    detailData();
  }, []);

  console.log(mDetail);
  console.log(tvDetail);
  console.log(mTrailer);
  console.log(tvTrailer);

  const [bool, setBool] = useState(true);
  const [popup, setPopup] = useState("none");

  const handlePopup = () => {
    if (bool) {
      setPopup("block");
      setBool(false);
    } else if (!bool) {
      setPopup("none");
      setBool(true);
    }
  };

  const exit = () => {
    console.log("클릭=>닫기");
  };

  return (
    <Wrap>
      <Title>{contentsClass}</Title>

      <Swiper
        modules={[Scrollbar]}
        scrollbar={{ draggable: true }}
        spaceBetween={15}
        slidesPerView={7.3}
      >
        {tvData.map((tvShow) => (
          <SwiperSlide key={tvShow.id}>
            <Con onClick={handlePopup} className={tvShow.id}>
              <Poster>
                <img src={`${imgUrl}${tvShow.poster_path}`} />
              </Poster>
              <Name>{tvShow.name}</Name>
            </Con>
          </SwiperSlide>
        ))}
      </Swiper>
      <Popup apear={popup}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {mDetail && tvDetail && (
              <DetailPopup
                mDetail={mDetail}
                mTrailer={mTrailer}
                tvDetail={tvDetail}
                tvTrailer={tvTrailer}
              />
            )}
          </>
        )}
        <ExitBtn onClick={exit}>
          <svg viewBox="0 0 512 512">
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z" />
          </svg>
        </ExitBtn>
      </Popup>
    </Wrap>
  );
};
