document.addEventListener('DOMContentLoaded', () => {
    const mapArea = document.getElementById('map-area');
    const mapTitle = document.getElementById('map-title');
    const toggleBtns = document.querySelectorAll('.map-toggle-btn');
    const markers = document.querySelectorAll('.marker');

    // 📌 추가: <img> 요소와 이미지 URL 정의
    const mapBackgroundImage = document.getElementById('map-background-image');

    const IMAGE_URLS = {
        '14': 'https://i.postimg.cc/DZgFJHkP/gwageo.png', // 14세 (과거) 지도 이미지 URL
        '22': 'https://i.postimg.cc/027m26xN/hyeonjae.png' // 22세 (현재) 지도 이미지 URL
    };
    // ------------------------------------

    // 모달 관련 요소
    const modal = document.getElementById('modal');
    const modalPlaceName = document.getElementById('modal-place-name');
    const modalColorBadge = document.getElementById('modal-color-badge');
    const modalMemoryMain = document.getElementById('modal-memory-main');
    const modalMemorySub = document.getElementById('modal-memory-sub');
    const modalAgeInfo = document.getElementById('modal-age-info');
    const closeBtn = document.querySelector('.close-btn');

    // 색깔 이름 매핑
    const colorNames = {
        'red': '싫은 장소',
        'green': '좋은 장소',
        'yellow': '보통 장소'
    };

    // 추억 데이터 (메인 내용과 인용구 형태의 서브 내용 구분)
    const memories = {
        "테일러 커피": {
            "22": {
                main: "졸업 후 첫 면접을 앞두고 무거운 책임감을 느꼈던 곳입니다. 씁쓸하면서도 달콤한 커피 맛처럼, 불안과 기대로 가득했던 나의 22세의 공간.",
                sub: "성인이 되어서야 비로소 알게 된 '홍대 감성'."
            },
            "14": {
                main: "14세 때는 몰랐던, 어른들의 멋진 카페였습니다. 왠지 모르게 들어가기 어려웠지만, 나도 언젠가 저런 곳에서 여유를 즐기고 싶다고 생각했죠.",
                sub: "어린 시절의 '어른스러운' 로망."
            }
        },
        "홍대 놀이터": {
            "22": {
                main: "여전히 자유분방한 에너지가 넘치지만, 나는 더 이상 관객일 뿐입니다. 잠시 벤치에 앉아 지나가는 청춘들을 보며 나의 14세를 회상합니다.",
                sub: "변하지 않는 곳에서 변해버린 나를 발견하다."
            },
            "14": {
                main: "친구들과 춤 연습을 하거나 플리마켓에서 신기한 물건들을 구경하던 아지트였습니다. 가장 순수하고 열정적이었던 추억이 가득한 장소.",
                sub: "우리의 모든 것이 시작된 곳."
            }
        },
        "수 노래방": {
            "22": {
                main: "취업 스트레스 해소 1순위. 동기들과 새벽까지 소리 지르며 노래를 불렀던 곳입니다. 다음 날의 피곤함보다 지금의 해방감이 중요했던 그 날 밤.",
                sub: "마이크를 잡으면 모든 것이 잊혀지는 해방감."
            },
            "14": {
                main: "중학생 때 몰래 교복 입고 갔다가 선생님을 만날까봐 조마조마했던 기억입니다. 그땐 노래 한 곡 부르는 것도 큰 일탈이었죠.",
                sub: "사춘기의 아슬아슬한 일탈의 추억."
            }
        },
        "은하수 다방": {
            "22": {
                main: "화려한 홍대 속에서 변치 않는 낭만을 발견하여 위로를 받은 곳입니다. 인디밴드 공연의 잔잔한 여운과 함께 따뜻한 차를 마셨습니다.",
                sub: "홍대에도 '시간이 멈춘' 공간이 있다."
            },
            "14": {
                main: "어둡고 오래된 간판에 무심하게 지나쳤던 곳입니다. 왠지 어른들만 가는 곳 같아서 가볼 생각조차 못했던 신비로운 장소였죠.",
                sub: "14세에게는 미지의 세계였던 곳."
            }
        },
        "길거리 분식집": {
            "22": {
                main: "지금은 사라지고 옷가게가 된 곳입니다. 나의 14세 추억이 사라진 것을 깨닫고 씁쓸함을 느꼈지만, 홍대의 변화를 받아들여야 했죠.",
                sub: "추억은 남았지만, 장소는 사라졌다."
            },
            "14": {
                main: "학원 끝나고 친구들과 500원짜리 떡꼬치를 먹던 곳. 세상에서 가장 맛있었고, 그 순간이 영원할 것만 같았던 소중한 아지트.",
                sub: "가장 행복했던 500원의 맛."
            }
        },
        "AK 플라자": {
            "22": {
                main: "친구를 기다릴 때 잠시 들러 구경하는 정도의 장소. 예전만큼의 특별함은 없지만, 여전히 홍대의 랜드마크로서 기능하고 있습니다.",
                sub: "지루함을 달래는 잠시의 쉼터."
            },
            "14": {
                main: "새 학기 옷을 사거나 친구들끼리 모여 최신 유행하는 물건들을 구경하던 꿈의 공간이었습니다. 돈은 없어도 보는 것만으로도 행복했어요.",
                sub: "그때는 이곳이 '힙' 그 자체였다."
            }
        }
    };

    function updateMap(age) {
        const is14 = age === '14';
        const currentAgeClass = is14 ? 'age-14-map' : 'age-22-map';
        const currentTitleClass = is14 ? 'title-14' : 'title-22';
        const currentTitleText = is14 ? '🕰️ 14세의 홍대' : '✨ 22세의 홍대';

        // 1. 지도 배경 및 제목 업데이트
        mapArea.className = '';
        mapArea.classList.add(currentAgeClass);
        mapTitle.className = '';
        mapTitle.classList.add(currentTitleClass);
        mapTitle.innerHTML = currentTitleText;
        
        // 📌 핵심 수정: <img> 태그의 src 속성 변경
        mapBackgroundImage.src = IMAGE_URLS[age];
        mapBackgroundImage.alt = is14 ? '홍대 과거 지도' : '홍대 현재 지도';
        // ---------------------------------

        // 2. 버튼 활성화 상태 업데이트
        toggleBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.age === age) {
                btn.classList.add('active');
            }
        });

        // 3. 마커 가시성 업데이트
        markers.forEach(marker => {
            if (marker.dataset.age === age) {
                marker.classList.add('visible');
            } else {
                marker.classList.remove('visible');
            }
        });
    }

    // 초기 지도 설정 (14세)
    updateMap('14');

    // 맵 전환 버튼 이벤트 리스너
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 버튼 자체 또는 아이콘을 클릭해도 동작하도록 .closest 사용
            const newAge = e.target.closest('.map-toggle-btn').dataset.age;
            updateMap(newAge);
        });
    });

    // 마커 클릭 이벤트 리스너 (팝업 표시)
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const fullName = marker.dataset.name;
            const placeName = fullName.split(' (')[0];
            const markerAge = marker.dataset.age;
            const color = marker.dataset.color;

            const memoryData = memories[placeName] ? memories[placeName][markerAge] : { main: "추억 기록이 없습니다.", sub: "기록이 없어 아쉽네요." };

            // 모달 내용 채우기
            modalPlaceName.textContent = placeName;

            // 뱃지 설정
            modalColorBadge.textContent = colorNames[color];
            modalColorBadge.className = '';
            modalColorBadge.classList.add('badge-' + color);

            modalMemoryMain.textContent = memoryData.main;
            modalMemorySub.textContent = `"${memoryData.sub}"`;

            modalAgeInfo.textContent = `나의 홍대, ${markerAge}세의 기억.`;

            // 모달 보여주기
            modal.classList.remove('hidden');
        });
    });

    // 모달 닫기 이벤트 리스너
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
});
