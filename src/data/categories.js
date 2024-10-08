import actionImg from "../assets/action.png";
import dramaImg from "../assets/drama.png";
import fantasyImg from "../assets/fantasy.png";
import fictionImg from "../assets/fiction.png";
import horrorImg from "../assets/horror.png";
import musicImg from "../assets/music.png";
import romanceImg from "../assets/romance.png";
import thrillerImg from "../assets/thriller.png";
import westernImg from "../assets/western.png";

const categories = [
  { name: "Action", color: "#ff5108", image: actionImg },
  { name: "Drama", color: "#d7a4ff", image: dramaImg },
  { name: "Adventure", color: "#148a08", image: romanceImg },
  { name: "Crime", color: "#84c2ff", image: thrillerImg },
  { name: "Comedy", color: "#902500", image: westernImg },
  { name: "Horror", color: "#7358ff", image: horrorImg },
  { name: "Animation", color: "#ff4ade", image: fantasyImg },
  { name: "Film-Noir", color: "#e61e32", image: musicImg },
  { name: "Fiction", color: "#6cd061", image: fictionImg },
];

export default categories;
