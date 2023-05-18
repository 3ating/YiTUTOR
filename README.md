# YiTUTOR

[YiTUTOR](https://yitutor.vercel.app/) is an online tutoring platform facilitating virtual classes via interactive whiteboards, video conferencing and chatrooom, complemented by an AI assistant for enhanced learning support.

## About YiTUTOR

-   Developed using Next.js and TypeScript, and deployed on Vercel.
-   Built a membership system with Firebase Authentication, avoiding props drilling using useContext.
-   Created a high-performance tutor search system with nested filters, enabling students to find tutors based on their needs. Efficiently managing data with Firestore database for CRUD interactions.
-   Implemented video communication using WebRTC API without libraries, providing users with the option to enable or disable video, audio, and microphone.
-   Established a whiteboard feature using Canvas API without libraries, providing options for pen customization, shape drawing, and functions such as copy, paste, delete, move, resize, and clear.
-   Created a real-time chatroom using Firestore onSnapshot API, facilitating user communication during online classes.
-   Integrated the AI assistant with the GPT-3.5 API, using prompts to restrict questions only to those related to learning.

## Built with

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

**Base**

-   React.js
-   TypeScript
-   Next.js
-   Firebase
-   Styled Components
-   WebRTC
-   Canvas

**Libraries**

-   antd
-   react-select
-   react-spinners

## Flow chart

![YiTUTOR](./assets//images/flow_chart.png)

## Demo

-   Students buy courses and book the time with tutors.

<img src="./assets/demos/buy_and_book.gif" width="500">

-   In an online classroom, students can experience various features that facilitate the learning process, including video conferencing, a whiteboard, and a chatroom.

1. Users with the option to enable or disable video, audio, and microphone.
   <img src="./assets/demos/video.gif" width="500">
2. In the whiteboard, users have access to features such as pen customization, shape drawing, as well as features like copy, paste, delete, move, resize, and clear.
   <img src="./assets/demos/whiteboard.gif" width="500">
3. The real-time chat room enables both parties to communicate instantly during class.
   <img src="./assets/demos/chatroom.gif" width="500">
4. The AI assistant restricts users to asking only questions related to learning.
   <img src="./assets/demos/ai-assistant.gif" width="500">

## Contact

<a href="https://www.linkedin.com/in/yi-ting-lin-082265233/" text-decoration="none">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>
<a href="mailto:etlin1401@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
</a>
