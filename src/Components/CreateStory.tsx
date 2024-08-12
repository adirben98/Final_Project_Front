import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import heroService from "../Services/heroService";
export interface IStory {
  hero: string;
  prompt: string;
}

export default function CreateStory() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setError,
  } = useForm<IStory>();

  const generate = (data: IStory) => {
    
  };
  const [options, setOptions] = useState<string[]>([]);
  const { getHeroes, cancelHeroes } = heroService.getHeroes();

  useEffect(() => {
    getHeroes.then((res) => {
      setOptions(res.data.map((hero) => hero.name));
    });
    return cancelHeroes();
  }, []);
  return (
    <form
      onSubmit={handleSubmit(generate)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <select name="heroes" id="hero-select">
        {options.map((hero) => (
          <option value={hero}>{hero}</option>
        ))}
      </select>
      <textarea
        placeholder="Prompt"
        {...register("prompt", { required: "Prompt is required" })}
      />
      <button type="submit">Generate</button>
    </form>
  );
}
