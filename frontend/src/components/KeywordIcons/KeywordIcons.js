import React from 'react';
import styles from './KeywordIcons.module.css';

// 키워드와 SVG 아이콘 매핑

const keywordIcons = {
    '사기를 불어넣는': (
        <div className={styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="30" viewBox="0 0 23 30" fill="none">
                <path
                    d="M5.81714 21.21C5.29665 20.7178 5.56798 20.8566 4.31257 20.5389C3.74297 20.3944 3.24225 20.1169 2.78944 19.7844L0.0719926 26.085C-0.190947 26.695 0.300193 27.3577 0.996176 27.3328L4.15206 27.2189L6.32266 29.3871C6.80182 29.8651 7.64275 29.7162 7.90569 29.1062L11.0232 21.8778C10.374 22.2199 9.65343 22.4204 8.90833 22.4204C7.74038 22.4204 6.6431 21.9905 5.81714 21.21ZM22.928 26.085L20.2106 19.7844C19.7578 20.1175 19.257 20.3944 18.6874 20.5389C17.4254 20.8583 17.7022 20.719 17.1829 21.21C16.3569 21.9905 15.259 22.4204 14.0911 22.4204C13.346 22.4204 12.6254 22.2194 11.9762 21.8778L15.0937 29.1062C15.3567 29.7162 16.1982 29.8651 16.6767 29.3871L18.8479 27.2189L22.0038 27.3328C22.6998 27.3577 23.1909 26.6945 22.928 26.085ZM15.7526 19.9283C16.6678 19.0476 16.7726 19.1234 18.0759 18.7876C18.9078 18.5729 19.5583 17.947 19.7811 17.1462C20.2291 15.5376 20.1129 15.7319 21.3354 14.5549C21.9445 13.9687 22.1823 13.114 21.9595 12.3131C21.5121 10.7057 21.5115 10.93 21.9595 9.32085C22.1823 8.51997 21.9445 7.66528 21.3354 7.07906C20.1129 5.90209 20.2291 6.0958 19.7811 4.4878C19.5583 3.68692 18.9078 3.06105 18.0759 2.84639C16.406 2.41536 16.6073 2.52808 15.3836 1.35054C14.7745 0.764322 13.8862 0.534932 13.0543 0.749596C11.385 1.18006 11.618 1.18062 9.94572 0.749596C9.11378 0.534932 8.22553 0.763756 7.61639 1.35054C6.39393 2.52751 6.59518 2.41536 4.9247 2.84639C4.09276 3.06105 3.4423 3.68692 3.21949 4.4878C2.77207 6.0958 2.88767 5.90209 1.66521 7.07906C1.05607 7.66528 0.817688 8.51997 1.0411 9.32085C1.48851 10.9271 1.48911 10.7029 1.0411 12.3125C0.818287 13.1134 1.05607 13.9681 1.66521 14.5549C2.88767 15.7319 2.77147 15.5376 3.21949 17.1462C3.4423 17.947 4.09276 18.5729 4.9247 18.7876C6.26516 19.1331 6.36518 19.0787 7.24744 19.9283C8.03985 20.6912 9.27429 20.8277 10.2266 20.2579C10.6075 20.0293 11.0492 19.9079 11.5003 19.9079C11.9514 19.9079 12.3931 20.0293 12.774 20.2579C13.7257 20.8277 14.9601 20.6912 15.7526 19.9283ZM5.84949 10.6372C5.84949 7.63356 8.37946 5.19863 11.5 5.19863C14.6205 5.19863 17.1505 7.63356 17.1505 10.6372C17.1505 13.6407 14.6205 16.0757 11.5 16.0757C8.37946 16.0757 5.84949 13.6407 5.84949 10.6372Z"
                    fill="white"
                />
            </svg>
            <div className={styles.iconText}>사기를 불어넣는</div>
        </div>
    ),
    도전적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M11.25 1.60247C11.25 0.672779 9.65365 0.322388 8.95052 1.09309C2.5 8.16457 11.6667 8.48293 11.6667 11.9204C11.6667 13.3122 10.1505 14.4384 8.28906 14.42C6.45729 14.4025 5 13.2571 5 11.8833V8.54308C5 7.69543 3.62135 7.2841 2.84219 7.89855C1.44792 8.99699 0 10.8786 0 13.1704C0 17.306 4.48594 20.6704 10 20.6704C15.5141 20.6704 20 17.306 20 13.1704C20 6.51848 11.25 5.63137 11.25 1.60247Z"
                fill="white"
            />
        </svg>
    ),
    '개성이 뚜렷한': (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
            <path
                d="M10.9375 5.35791L11.7188 3.79541L13.2812 3.01416L11.7188 2.23291L10.9375 0.67041L10.1562 2.23291L8.59375 3.01416L10.1562 3.79541L10.9375 5.35791ZM3.90625 8.48291L5.20801 5.87891L7.8125 4.57666L5.20801 3.27441L3.90625 0.67041L2.60449 3.27441L0 4.57666L2.60449 5.87891L3.90625 8.48291ZM21.0938 14.7329L19.792 17.3369L17.1875 18.6392L19.792 19.9414L21.0938 22.5454L22.3955 19.9414L25 18.6392L22.3955 17.3369L21.0938 14.7329ZM24.542 5.27148L20.3989 1.12842C20.0942 0.822754 19.6943 0.67041 19.2944 0.67041C18.8945 0.67041 18.4946 0.822754 18.1895 1.12842L0.458008 18.8599C-0.152344 19.4702 -0.152344 20.4595 0.458008 21.0693L4.60107 25.2124C4.90625 25.5176 5.30615 25.6699 5.70557 25.6699C6.10547 25.6699 6.50537 25.5176 6.81055 25.2124L24.542 7.48047C25.1523 6.87109 25.1523 5.88135 24.542 5.27148ZM17.5513 10.605L15.0654 8.11914L19.2939 3.89062L21.7798 6.37646L17.5513 10.605Z"
                fill="white"
            />
        </svg>
    ),
    '결단력 있는': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M18.5005 6.92041H11.288L13.9505 1.8501C14.2005 1.25635 13.4818 0.67041 12.5005 0.67041H3.50062C2.75063 0.67041 2.11314 1.01807 2.01314 1.48291L0.013161 10.8579C-0.105588 11.4204 0.594404 11.9204 1.50064 11.9204H8.91931L6.03809 19.5181C5.81309 20.1118 6.53809 20.6704 7.49433 20.6704C8.01932 20.6704 8.51931 20.4985 8.79431 20.2017L19.7942 8.32666C20.3754 7.70557 19.6567 6.92041 18.5005 6.92041Z"
                fill="white"
            />
        </svg>
    ),
    '공감능력이 좋은': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M16.8892 4.8064C14.218 2.79841 10.6677 2.34135 7.71838 2.94695C4.41874 -0.673997 0.721179 0.991495 0 1.47028C0 1.47028 2.53749 3.92349 2.12534 6.07212C-0.878817 9.55638 0.549304 13.4357 2.12534 15.2675C2.53749 17.4161 0 19.8693 0 19.8693C0.714234 20.3497 4.40173 22.01 7.71838 18.4077C10.6611 19.0093 14.2114 18.5562 16.8892 16.5446C21.0302 13.5368 21.0437 7.82965 16.8892 4.80601V4.8064ZM10.2146 16.5253C9.18188 16.5287 8.15329 16.3777 7.15519 16.0761L6.46874 16.8303C6.08744 17.251 5.66049 17.6146 5.19825 17.9123C4.63744 18.2335 4.0282 18.431 3.40277 18.4942C3.43749 18.4239 3.46805 18.3535 3.49895 18.2872C4.18575 16.8387 4.37094 15.5391 4.0545 14.3885C2.92499 13.3768 2.24895 12.0838 2.24895 10.67C2.24895 7.43066 5.81631 4.8064 10.2146 4.8064C14.6128 4.8064 18.1802 7.43066 18.1802 10.67C18.1802 13.9093 14.6128 16.5253 10.2146 16.5253ZM6.39304 12.0645C6.07769 12.0696 5.77344 11.9322 5.54694 11.6825C5.32045 11.4328 5.19019 11.0912 5.18471 10.7324C5.16041 8.93932 7.53991 8.90021 7.56387 10.6894V10.7095C7.56534 10.886 7.5362 11.0611 7.47814 11.2248C7.42008 11.3885 7.33422 11.5376 7.22548 11.6635C7.11674 11.7894 6.98724 11.8897 6.84441 11.9587C6.70157 12.0276 6.54819 12.0638 6.39304 12.0653V12.0645ZM8.95449 10.7324C8.92706 8.93932 11.3066 8.89626 11.334 10.6854V10.7095C11.3475 12.4903 8.98192 12.5097 8.95449 10.7324ZM13.933 12.0645C13.6176 12.0696 13.3133 11.9322 13.0867 11.6825C12.8602 11.4329 12.7298 11.0912 12.7243 10.7324C12.7003 8.93932 15.0798 8.90021 15.1038 10.6894V10.7095C15.1058 10.8862 15.077 11.0615 15.0191 11.2255C14.9612 11.3895 14.8754 11.5388 14.7665 11.6648C14.6577 11.7908 14.528 11.8911 14.3849 11.9598C14.2419 12.0286 14.0883 12.0644 13.933 12.0653V12.0645Z"
                fill="white"
            />
        </svg>
    ),
    사교적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M15.7143 13.1704C14.705 13.1704 13.7774 13.4758 13.0451 13.9866L8.46982 11.4845C8.60531 10.9482 8.60531 10.3925 8.46982 9.85627L13.0451 7.35416C13.7774 7.86498 14.705 8.17041 15.7143 8.17041C18.0812 8.17041 20 6.49147 20 4.42041C20 2.34936 18.0812 0.67041 15.7143 0.67041C13.3474 0.67041 11.4286 2.34936 11.4286 4.42041C11.4286 4.70002 11.4638 4.97236 11.5302 5.23451L6.95491 7.73662C6.22263 7.22584 5.295 6.92041 4.28571 6.92041C1.91879 6.92041 0 8.59936 0 10.6704C0 12.7415 1.91879 14.4204 4.28571 14.4204C5.295 14.4204 6.22263 14.115 6.95491 13.6042L11.5302 16.1063C11.4626 16.3736 11.4285 16.6466 11.4286 16.9204C11.4286 18.9915 13.3474 20.6704 15.7143 20.6704C18.0812 20.6704 20 18.9915 20 16.9204C20 14.8494 18.0812 13.1704 15.7143 13.1704Z"
                fill="white"
            />
        </svg>
    ),
    경청하는: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21" fill="none">
            <path
                d="M24.8012 6.15612C17.8804 -1.1595 7.11677 -1.15682 0.198795 6.15612C-0.0613614 6.43112 -0.0664395 6.89675 0.185123 7.18202L1.52262 8.69853C1.76247 8.97086 2.14841 8.97666 2.39762 8.7155C8.09763 2.74764 16.9015 2.7463 22.6027 8.7155C22.8519 8.97666 23.2379 8.97041 23.4777 8.69853L24.8152 7.18202C25.0664 6.89675 25.0613 6.43112 24.8012 6.15612ZM12.5 14.9561C11.1191 14.9561 9.99997 16.2351 9.99997 17.8133C9.99997 19.3914 11.1191 20.6704 12.5 20.6704C13.8808 20.6704 15 19.3914 15 17.8133C15 16.2351 13.8808 14.9561 12.5 14.9561ZM20.4168 11.2244C15.9144 6.67398 9.08044 6.67889 4.58317 11.2244C4.31364 11.4967 4.30505 11.9695 4.56091 12.2579L5.90622 13.7753C6.14059 14.0396 6.51794 14.0575 6.76755 13.811C10.0468 10.5713 14.9605 10.5784 18.232 13.811C18.4816 14.0575 18.859 14.0401 19.0933 13.7753L20.4387 12.2579C20.6949 11.9695 20.6859 11.4963 20.4168 11.2244Z"
                fill="white"
            />
        </svg>
    ),
    꼼꼼한: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M1.25 19.2418C1.25 20.032 1.80859 20.6704 2.5 20.6704H17.5C18.1914 20.6704 18.75 20.032 18.75 19.2418V6.3847H1.25V19.2418ZM7.5 9.77755C7.5 9.48291 7.71094 9.24184 7.96875 9.24184H12.0312C12.2891 9.24184 12.5 9.48291 12.5 9.77755V10.1347C12.5 10.4293 12.2891 10.6704 12.0312 10.6704H7.96875C7.71094 10.6704 7.5 10.4293 7.5 10.1347V9.77755ZM18.75 0.67041H1.25C0.558594 0.67041 0 1.3088 0 2.09898V4.24184C0 4.6347 0.28125 4.95612 0.625 4.95612H19.375C19.7188 4.95612 20 4.6347 20 4.24184V2.09898C20 1.3088 19.4414 0.67041 18.75 0.67041Z"
                fill="white"
            />
        </svg>
    ),
    '리더십 있는': (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
            <path
                d="M25 16.2953V24.1078C25 24.9706 24.3003 25.6703 23.4375 25.6703H15.625C14.7622 25.6703 14.0625 24.9706 14.0625 24.1078V16.2953C14.0625 15.4325 14.7622 14.7328 15.625 14.7328H23.4375C24.3003 14.7328 25 15.4325 25 16.2953ZM6.25 13.1703C2.79834 13.1703 0 15.9686 0 19.4203C0 22.8719 2.79834 25.6703 6.25 25.6703C9.70166 25.6703 12.5 22.8719 12.5 19.4203C12.5 15.9686 9.70166 13.1703 6.25 13.1703ZM23.3901 11.6078C24.6274 11.6078 25.4009 10.3055 24.7822 9.26404L20.1421 1.45154C19.5234 0.410034 17.9766 0.410034 17.3579 1.45154L12.7178 9.26404C12.0991 10.3055 12.8726 11.6078 14.1099 11.6078H23.3901Z"
                fill="white"
            />
        </svg>
    ),
    계획적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M0 18.7954C0 19.8306 0.959821 20.6704 2.14286 20.6704H17.8571C19.0402 20.6704 20 19.8306 20 18.7954V8.17041H0V18.7954ZM14.2857 11.1392C14.2857 10.8813 14.5268 10.6704 14.8214 10.6704H16.6071C16.9018 10.6704 17.1429 10.8813 17.1429 11.1392V12.7017C17.1429 12.9595 16.9018 13.1704 16.6071 13.1704H14.8214C14.5268 13.1704 14.2857 12.9595 14.2857 12.7017V11.1392ZM14.2857 16.1392C14.2857 15.8813 14.5268 15.6704 14.8214 15.6704H16.6071C16.9018 15.6704 17.1429 15.8813 17.1429 16.1392V17.7017C17.1429 17.9595 16.9018 18.1704 16.6071 18.1704H14.8214C14.5268 18.1704 14.2857 17.9595 14.2857 17.7017V16.1392ZM8.57143 11.1392C8.57143 10.8813 8.8125 10.6704 9.10714 10.6704H10.8929C11.1875 10.6704 11.4286 10.8813 11.4286 11.1392V12.7017C11.4286 12.9595 11.1875 13.1704 10.8929 13.1704H9.10714C8.8125 13.1704 8.57143 12.9595 8.57143 12.7017V11.1392ZM8.57143 16.1392C8.57143 15.8813 8.8125 15.6704 9.10714 15.6704H10.8929C11.1875 15.6704 11.4286 15.8813 11.4286 16.1392V17.7017C11.4286 17.9595 11.1875 18.1704 10.8929 18.1704H9.10714C8.8125 18.1704 8.57143 17.9595 8.57143 17.7017V16.1392ZM2.85714 11.1392C2.85714 10.8813 3.09821 10.6704 3.39286 10.6704H5.17857C5.47321 10.6704 5.71429 10.8813 5.71429 11.1392V12.7017C5.71429 12.9595 5.47321 13.1704 5.17857 13.1704H3.39286C3.09821 13.1704 2.85714 12.9595 2.85714 12.7017V11.1392ZM2.85714 16.1392C2.85714 15.8813 3.09821 15.6704 3.39286 15.6704H5.17857C5.47321 15.6704 5.71429 15.8813 5.71429 16.1392V17.7017C5.71429 17.9595 5.47321 18.1704 5.17857 18.1704H3.39286C3.09821 18.1704 2.85714 17.9595 2.85714 17.7017V16.1392ZM17.8571 3.17041H15.7143V1.29541C15.7143 0.95166 15.3929 0.67041 15 0.67041H13.5714C13.1786 0.67041 12.8571 0.95166 12.8571 1.29541V3.17041H7.14286V1.29541C7.14286 0.95166 6.82143 0.67041 6.42857 0.67041H5C4.60714 0.67041 4.28571 0.95166 4.28571 1.29541V3.17041H2.14286C0.959821 3.17041 0 4.01025 0 5.04541V6.92041H20V5.04541C20 4.01025 19.0402 3.17041 17.8571 3.17041Z"
                fill="white"
            />
        </svg>
    ),
    열정적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M20 14.7104C20 14.9904 19.7216 15.1104 19.3968 15.2304C18.0974 15.7104 16.7053 16.1504 15.2204 16.1504C13.1323 16.1504 12.1578 15.0304 9.65197 15.0304C7.84223 15.0304 5.93968 15.5904 4.40835 16.1904C4.31555 16.2304 4.22274 16.2304 4.12993 16.2704V19.3104C4.12993 20.1465 3.39934 20.6704 2.59861 20.6704C1.71694 20.6704 1.02088 20.0704 1.02088 19.3104V4.67041C0.417633 4.27041 0 3.63041 0 2.91041C0 1.67041 1.16009 0.67041 2.59861 0.67041C4.03712 0.67041 5.19722 1.67041 5.19722 2.91041C5.19722 3.63041 4.82599 4.27041 4.17633 4.67041V5.91041C4.36322 5.85674 6.83947 4.79041 9.37355 4.79041C12.3313 4.79041 13.7998 5.87041 15.1276 5.87041C16.891 5.87041 18.8399 4.79041 19.3039 4.79041C19.6752 4.79041 20 5.03041 20 5.31041V14.7104Z"
                fill="white"
            />
        </svg>
    ),
    눈치빠른: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="14" viewBox="0 0 25 14" fill="none">
            <path
                d="M18.4023 0.67041C15.8203 0.67041 13.8008 2.28369 12.5 3.74072C11.1992 2.28369 9.17969 0.67041 6.59766 0.67041C2.96094 0.67041 0 3.4751 0 6.92041C0 10.3657 2.96094 13.1704 6.59766 13.1704C9.17969 13.1704 11.1992 11.5571 12.5 10.1001C13.8008 11.5571 15.8203 13.1704 18.4023 13.1704C22.0391 13.1704 25 10.3657 25 6.92041C25 3.4751 22.0391 0.67041 18.4023 0.67041ZM6.59766 9.42041C5.02734 9.42041 3.75 8.29932 3.75 6.92041C3.75 5.5415 5.02734 4.42041 6.59766 4.42041C8.08984 4.42041 9.46484 5.83057 10.2695 6.92041C9.47266 7.99854 8.08594 9.42041 6.59766 9.42041ZM18.4023 9.42041C16.9102 9.42041 15.5352 8.01025 14.7305 6.92041C15.5273 5.84229 16.9141 4.42041 18.4023 4.42041C19.9727 4.42041 21.25 5.5415 21.25 6.92041C21.25 8.29932 19.9727 9.42041 18.4023 9.42041Z"
                fill="white"
            />
        </svg>
    ),
    완벽주의적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M18.4488 7.98729L15.8293 6.96268C15.0762 6.66803 14.5191 6.02871 14.3395 5.25278L13.7149 2.55398C13.2625 0.599865 10.7239 0.00340694 9.41879 1.54411L7.61645 3.67234C7.09849 4.28442 6.30631 4.60676 5.49928 4.53444L2.69148 4.28353C0.658292 4.10183 -0.704201 6.2872 0.385637 7.98148L1.8911 10.3218C2.32391 10.9946 2.39188 11.8335 2.07235 12.5647L0.961806 15.1086C0.157513 16.9502 1.85399 18.8977 3.83249 18.4039L6.56529 17.7217C7.35083 17.5257 8.18442 17.7217 8.79457 18.2454L10.9164 20.0682C12.4524 21.388 14.8633 20.4062 14.9965 18.4066L15.1801 15.6448C15.2328 14.8506 15.6801 14.1331 16.3766 13.7255L18.7984 12.3085C20.5515 11.2834 20.3449 8.72929 18.4488 7.98729Z"
                fill="white"
            />
        </svg>
    ),
    '책임감 강한': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M20 10.0454C20 9.12236 19.5503 8.3251 18.8889 7.89229V1.9208C18.8889 1.579 18.6465 0.67041 17.7778 0.67041C17.5306 0.67041 17.2851 0.763379 17.084 0.944629L14.1316 3.60205C12.6486 4.93564 10.7868 5.67041 8.88889 5.67041H2.22222C0.994792 5.67041 0 6.78955 0 8.17041V11.9204C0 13.3013 0.994792 14.4204 2.22222 14.4204H3.39236C3.3441 14.8298 3.31667 15.2462 3.31667 15.6704C3.31667 17.2239 3.63819 18.6919 4.20417 20.004C4.38438 20.4216 4.77778 20.6704 5.19028 20.6704H7.76944C8.67396 20.6704 9.21701 19.5048 8.66875 18.6954C8.09931 17.8548 7.76076 16.8063 7.76076 15.6704C7.76076 15.2364 7.81701 14.8192 7.91389 14.4204H8.88889C10.7868 14.4204 12.6486 15.1552 14.1313 16.4888L17.0837 19.1462C17.2806 19.3235 17.5252 19.4202 17.7774 19.4204C18.6427 19.4204 18.8885 18.5306 18.8885 18.1704V12.1989C19.5503 11.7657 20 10.9685 20 10.0454ZM16.6667 15.5696L15.5191 14.5368C13.6441 12.8493 11.2889 11.9204 8.88889 11.9204V8.17041C11.2889 8.17041 13.6441 7.2415 15.5191 5.554L16.6667 4.52119V15.5696Z"
                fill="white"
            />
        </svg>
    ),
    논리적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M13.9792 3.91714L17.1111 7.44126C17.2431 7.58973 17.2431 7.83196 17.1111 7.98043L9.52778 16.5133L6.30556 16.9158C5.875 16.9705 5.51042 16.5602 5.55903 16.0758L5.91667 12.4501L13.5 3.91714C13.6319 3.76867 13.8472 3.76867 13.9792 3.91714ZM19.6042 3.02243L17.9097 1.11581C17.3819 0.521944 16.5243 0.521944 15.9931 1.11581L14.7639 2.49889C14.6319 2.64736 14.6319 2.88959 14.7639 3.03806L17.8958 6.56219C18.0278 6.71065 18.2431 6.71065 18.375 6.56219L19.6042 5.1791C20.1319 4.58133 20.1319 3.6163 19.6042 3.02243ZM13.3333 14.1926V18.1699H2.22222V5.66748H10.2014C10.3125 5.66748 10.4167 5.61669 10.4965 5.53073L11.8854 3.96793C12.1493 3.671 11.9618 3.16699 11.5903 3.16699H1.66667C0.746528 3.16699 0 4.007 0 5.04236V18.795C0 19.8304 0.746528 20.6704 1.66667 20.6704H13.8889C14.809 20.6704 15.5556 19.8304 15.5556 18.795V12.6298C15.5556 12.2117 15.1076 12.0047 14.8438 12.2977L13.4549 13.8605C13.3785 13.9503 13.3333 14.0676 13.3333 14.1926Z"
                fill="white"
            />
        </svg>
    ),
    주관있는: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
            <path
                d="M0 12.9809V3.01416C0 1.71973 1.04932 0.67041 2.34375 0.67041H12.3104C12.932 0.670413 13.5282 0.917346 13.9677 1.35688L24.3135 11.7027C25.2288 12.618 25.2288 14.102 24.3135 15.0172L14.3468 24.9839C13.4315 25.8992 11.9476 25.8992 11.0323 24.9839L0.686475 14.6381C0.246935 14.1986 3.25037e-06 13.6025 0 12.9809ZM5.46875 3.79541C4.17432 3.79541 3.125 4.84473 3.125 6.13916C3.125 7.43359 4.17432 8.48291 5.46875 8.48291C6.76318 8.48291 7.8125 7.43359 7.8125 6.13916C7.8125 4.84473 6.76318 3.79541 5.46875 3.79541Z"
                fill="white"
            />
        </svg>
    ),
    '융통성 있는': (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
            <path
                d="M23.9221 12.4722C20.3625 8.92236 15.6506 4.17627 12.1301 0.67041C4.04907 8.72217 0.289307 12.4722 0.289307 12.4722C-0.0964355 12.8579 -0.0964355 13.4829 0.289307 13.8735C6.77368 20.3335 3.30689 16.8765 12.1301 25.6704C30.6555 7.21338 12.8967 24.855 23.9221 13.8687C24.3127 13.4829 24.3127 12.8579 23.9221 12.4722ZM12.1301 16.8667L8.41919 13.1704L12.1301 9.47412L15.8411 13.1704L12.1301 16.8667Z"
                fill="white"
            />
        </svg>
    ),
    '적응력 좋은': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M18.9652 1.05019C18.7707 0.561973 18.2151 0.542445 17.9824 1.00332C16.906 3.10851 14.9787 4.42083 12.7771 4.42083H9.99905C6.31814 4.42083 3.33175 7.77976 3.33175 11.9198C3.33175 12.1932 3.35953 12.4549 3.38384 12.7205C5.59933 10.9356 8.79755 9.42016 13.3327 9.42016C13.6383 9.42016 13.8883 9.70137 13.8883 10.0451C13.8883 10.3888 13.6383 10.67 13.3327 10.67C4.6027 10.67 0.900964 16.6887 0.0814413 18.9501C-0.147747 19.5868 0.123112 20.3132 0.689138 20.5749C1.25864 20.8405 1.90453 20.532 2.14066 19.8992C2.19275 19.7586 2.86643 18.0284 4.63743 16.3606C5.76254 18.0753 7.90163 19.7117 10.7109 19.3759C16.1628 18.9306 20 13.4313 20 6.69787C20 4.7372 19.625 2.70622 18.9652 1.05019Z"
                fill="white"
            />
        </svg>
    ),
    현실적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M19.8961 12.6724C19.6984 12.2157 19.2481 11.9204 18.75 11.9204H16.25V3.79541C16.25 2.93604 15.5469 2.23291 14.6875 2.23291C13.8281 2.23291 13.125 2.93604 13.125 3.79541V9.02979C13.125 9.24541 12.95 9.42041 12.7344 9.42041H11.9531C11.7375 9.42041 11.5625 9.24541 11.5625 9.02979V2.23291C11.5625 1.37354 10.8594 0.67041 10 0.67041C9.14062 0.67041 8.4375 1.37354 8.4375 2.23291V9.02979C8.4375 9.24541 8.2625 9.42041 8.04687 9.42041H7.26562C7.05 9.42041 6.875 9.24541 6.875 9.02979V3.79541C6.875 2.93604 6.17187 2.23291 5.3125 2.23291C4.45312 2.23291 3.75 2.93604 3.75 3.79541V11.9204H1.24999C0.751947 11.9204 0.301556 12.2157 0.1039 12.6724C0.00664855 12.8956 -0.0232012 13.1424 0.018025 13.3824C0.0592512 13.6224 0.169754 13.8451 0.335931 14.0231L4.34726 18.3212C5.74101 19.8142 7.80039 20.6704 10 20.6704C12.1996 20.6704 14.259 19.8142 15.6531 18.3212L19.6641 14.0231C19.8302 13.8451 19.9408 13.6224 19.982 13.3824C20.0232 13.1424 19.9934 12.8956 19.8961 12.6724ZM10 16.9204C7.92891 16.9204 6.25 14.4204 6.25 14.4204C6.25 14.4204 7.92891 11.9204 10 11.9204C12.0711 11.9204 13.75 14.4204 13.75 14.4204C13.75 14.4204 12.0711 16.9204 10 16.9204ZM10 13.1704C9.30976 13.1704 8.75 13.7302 8.75 14.4204C8.75 15.1106 9.30976 15.6704 10 15.6704C10.6902 15.6704 11.25 15.1106 11.25 14.4204C11.25 13.7302 10.6902 13.1704 10 13.1704Z"
                fill="white"
            />
        </svg>
    ),
    협력적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M2.5 3.52755H0C0 9.04987 3.91797 13.5276 8.75 13.5276V19.9561C8.75 20.349 9.03125 20.6704 9.375 20.6704H10.625C10.9688 20.6704 11.25 20.349 11.25 19.9561V13.5276C11.25 8.00523 7.33203 3.52755 2.5 3.52755ZM17.5 0.67041C14.2109 0.67041 11.3516 2.7463 9.85547 5.81327C10.9375 7.16148 11.7383 8.79987 12.1602 10.6168C16.5625 10.0945 20 5.84452 20 0.67041H17.5Z"
                fill="white"
            />
        </svg>
    ),
    '통찰력 있는': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M18.5954 0.796585L0.487941 11.2398C-0.219166 11.646 -0.129313 12.6301 0.573888 12.927L4.72668 14.6688L15.9505 4.78016C16.1654 4.58879 16.4701 4.8817 16.2865 5.10431L6.87534 16.5669V19.7108C6.87534 20.6324 7.98874 20.9957 8.53568 20.3278L11.0164 17.3089L15.8841 19.3475C16.4389 19.5819 17.0718 19.2343 17.1733 18.6368L19.9861 1.76514C20.119 0.976236 19.2712 0.406039 18.5954 0.796585Z"
                fill="white"
            />
        </svg>
    ),
    '트렌드 빠른': (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
            <path
                d="M24.6582 22.2866L19.79 17.4185C19.5703 17.1987 19.2725 17.0767 18.96 17.0767H18.1641C19.5117 15.353 20.3125 13.1851 20.3125 10.8267C20.3125 5.21631 15.7666 0.67041 10.1562 0.67041C4.5459 0.67041 0 5.21631 0 10.8267C0 16.437 4.5459 20.9829 10.1562 20.9829C12.5146 20.9829 14.6826 20.1821 16.4062 18.8345V19.6304C16.4062 19.9429 16.5283 20.2407 16.748 20.4604L21.6162 25.3286C22.0752 25.7876 22.8174 25.7876 23.2715 25.3286L24.6533 23.9468C25.1123 23.4878 25.1123 22.7456 24.6582 22.2866ZM10.1562 17.0767C6.7041 17.0767 3.90625 14.2837 3.90625 10.8267C3.90625 7.37451 6.69922 4.57666 10.1562 4.57666C13.6084 4.57666 16.4062 7.36963 16.4062 10.8267C16.4062 14.2788 13.6133 17.0767 10.1562 17.0767Z"
                fill="white"
            />
        </svg>
    ),

    '추진력 있는': (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M19.7316 1.41649C19.7065 1.2996 19.6481 1.19244 19.5635 1.1079C19.479 1.02336 19.3718 0.965037 19.2549 0.939938C17.9967 0.67041 17.0125 0.67041 16.0317 0.67041C11.9994 0.67041 9.58078 2.82663 7.776 5.67034H3.7046C3.35689 5.67063 3.01611 5.76756 2.72031 5.95028C2.42452 6.133 2.18535 6.39434 2.02954 6.70509L0.0985501 10.5644C0.0272389 10.7074 -0.00634427 10.8662 0.000987722 11.0258C0.00831971 11.1854 0.0563237 11.3404 0.140444 11.4763C0.224564 11.6121 0.342009 11.7242 0.481633 11.8019C0.621257 11.8796 0.778428 11.9203 0.938229 11.9203H4.99283L4.11486 12.798C3.88044 13.0324 3.74874 13.3503 3.74874 13.6818C3.74874 14.0132 3.88044 14.3311 4.11486 14.5655L6.10368 16.5542C6.21979 16.6703 6.35764 16.7624 6.50935 16.8252C6.66107 16.888 6.82368 16.9204 6.9879 16.9204C7.15212 16.9204 7.31473 16.888 7.46645 16.8252C7.61817 16.7624 7.75601 16.6703 7.87212 16.5542L8.75009 15.6764V19.7326C8.75004 19.8923 8.79081 20.0494 8.86851 20.1889C8.94622 20.3285 9.05829 20.4459 9.19411 20.5299C9.32992 20.614 9.48496 20.662 9.64454 20.6694C9.80412 20.6768 9.96293 20.6433 10.1059 20.5721L13.9624 18.6428C14.2738 18.4873 14.5356 18.2481 14.7185 17.9521C14.9014 17.6561 14.9982 17.315 14.9979 16.9671V12.8886C17.8342 11.08 19.9992 8.65428 19.9992 4.64301C20.0031 3.65865 20.0031 2.67429 19.7316 1.41649ZM15.0018 7.23282C14.6927 7.23282 14.3905 7.14118 14.1335 6.96949C13.8764 6.79781 13.6761 6.55378 13.5578 6.26827C13.4395 5.98277 13.4086 5.66861 13.4689 5.36552C13.5292 5.06242 13.678 4.78402 13.8966 4.5655C14.1152 4.34698 14.3937 4.19817 14.6969 4.13788C15 4.0776 15.3143 4.10854 15.5999 4.2268C15.8855 4.34506 16.1296 4.54533 16.3013 4.80227C16.473 5.05922 16.5647 5.36131 16.5647 5.67034C16.5647 6.08473 16.4 6.48216 16.1069 6.77518C15.8138 7.0682 15.4163 7.23282 15.0018 7.23282Z"
                fill="white"
            />
        </svg>
    ),
    체계적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M18.75 3.17041C19.4404 3.17041 20 2.75068 20 2.23291V1.60791C20 1.09014 19.4404 0.67041 18.75 0.67041H1.25C0.559635 0.67041 0 1.09014 0 1.60791V2.23291C0 2.75068 0.559635 3.17041 1.25 3.17041C1.25 6.72373 3.90708 9.72252 7.54385 10.6704C3.90708 11.6183 1.25 14.6171 1.25 18.1704C0.559635 18.1704 0 18.5901 0 19.1079V19.7329C0 20.2507 0.559635 20.6704 1.25 20.6704H18.75C19.4404 20.6704 20 20.2507 20 19.7329V19.1079C20 18.5901 19.4404 18.1704 18.75 18.1704C18.75 14.6171 16.0929 11.6183 12.4561 10.6704C16.0929 9.72252 18.75 6.72373 18.75 3.17041Z"
                fill="white"
            />
        </svg>
    ),
    창의적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path
                d="M9.34167 0.792145L1.21508 3.89253C0.48447 4.17077 0 4.88625 0 5.68122V14.6286C0 15.352 0.402422 16.0119 1.03536 16.3338L9.16195 20.4677C9.68939 20.738 10.3106 20.738 10.8381 20.4677L18.9646 16.3338C19.6015 16.0119 20 15.3481 20 14.6286V5.68122C20 4.88625 19.5155 4.17475 18.7849 3.89651L10.6583 0.79612C10.2364 0.629175 9.76753 0.629175 9.34167 0.792145ZM10.002 3.26053L17.5034 6.12243V6.16615L10.002 9.26654L2.50049 6.16615V6.12243L10.002 3.26053ZM11.2522 17.411V11.4925L17.5034 8.90881V14.2311L11.2522 17.411Z"
                fill="white"
            />
        </svg>
    ),
    긍정적인: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path
                d="M24.2188 12.7798C24.2188 19.4676 18.7972 24.8892 12.1094 24.8892C5.42153 24.8892 0 19.4676 0 12.7798C0 6.09194 5.42153 0.67041 12.1094 0.67041C18.7972 0.67041 24.2188 6.09194 24.2188 12.7798ZM21.875 12.7798L21.8749 12.766L20.6022 13.8764L17.5417 11.02L18.3451 6.90107L20.0201 7.05107C18.8048 5.38037 17.0902 4.11704 15.1026 3.47974L15.7692 5.03926L12.1094 7.06689L8.44956 5.03931L9.11611 3.47979C7.13218 4.11592 5.41592 5.37773 4.19868 7.05112L5.88643 6.90107L6.67705 11.02L3.6166 13.8764L2.34395 12.766L2.3438 12.7798C2.3438 14.8801 3.00283 16.879 4.22231 18.5411L4.59849 16.8859L8.75562 17.396L10.5281 21.1961L9.06807 22.0646C11.0311 22.7053 13.1838 22.7066 15.1507 22.0646L13.6906 21.1961L15.4631 17.396L19.6203 16.8859L19.9964 18.5411C21.216 16.879 21.875 14.8801 21.875 12.7798ZM9.76064 16.1768L8.30098 11.7182L12.1094 8.95811L15.9178 11.7182L14.4714 16.1768H9.76064Z"
                fill="white"
            />
        </svg>
    ),
};
export default keywordIcons;
