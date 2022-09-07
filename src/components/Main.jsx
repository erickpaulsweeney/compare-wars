import { useEffect, useState } from "react";

export default function Main() {
    const [value, setValue] = useState("");
    const [list, setList] = useState([]);
    const [highest, setHighest] = useState(null);

    const remove = (id) => {
        let newList = list.filter(el => el.id !== id);
        setList(newList);
    }

    const fetchRepo = async () => {
        const [owner, repo] = value.split("/");
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`
        );
        const data = await response.json();
        if (response.status === 200) {
            if (list.some((el) => el.id === data.id)) {
                alert("Repo already included");
                return;
            }
            let newList = [...list].concat(data);
            setList(newList);
            setValue("");
        } else {
            alert("Repository not found.");
            return;
        }
    };

    useEffect(() => {
        if (list.length > 0) {
            let target = list.reduce((prev, curr) => prev.watchers >= curr.watchers ? prev : curr);
            setHighest(target);
        }
        setValue("");
    }, [list])

    return (
        <div className="container-all">
            <div className="title">Compare Wars</div>
            <input
                type="text"
                placeholder="owner/repo"
                valuie={value}
                onChange={(ev) => setValue(ev.target.value)}
            />
            <button className="add-repo" onClick={fetchRepo}>
                Add for Comparison
            </button>
            <div className="container-main">
                {list.length > 0 &&
                    list.map((el) => (
                        <div
                            key={el.id}
                            className={
                                highest?.id === el.id ? "card highest" : "card"
                            }
                        >
                            <img className="avatar" src={el.owner.avatar_url} alt="" />
                            <div className="name">{el.full_name}</div>
                            <div className="description">{el.description}</div>
                            <div className="stars">Stars ⭐: {el.watchers}</div>
                            <div className="forks">
                                Forks &#9282;: {el.forks}
                            </div>
                            <div className="buttons">
                                <button className="remove" onClick={() => remove(el.id)}>Remove</button>
                                <a href={el.html_url} target="_blank" rel="noreferrer"><button className="visit">Visit Repo</button></a>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
