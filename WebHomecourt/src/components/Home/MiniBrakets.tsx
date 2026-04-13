import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type MiniBrack = {
  id: number;
  bracket_question_id1: number;
  bracket_question_id2: number;
  open_date: string;
  close_date: string;
  round: number;
  winner: number;
  question: string;
};

function getDaysLeft(pregunta: MiniBrack | null): string | null {
  if (!pregunta) return null;

  const now = new Date();
  const close = new Date(pregunta.close_date);

  const diffMs = close.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return `${diffDays} days left`;
};

export async function getMiniBracket(): Promise<MiniBrack> {
  const { data, error } = await supabase
  .from('bracket')
  .select('*')
  .lte('open_date', new Date().toISOString())
  .gte('close_date', new Date().toISOString())
  .is('winner', null);
  // Smth died
  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to get minibackets")
  }

  const normalizedData = Array.isArray(data) ? data[0] : data;
  if (!normalizedData) {
    throw new Error("No mini brackets found")
  }

  return normalizedData as MiniBrack
}

function MiniBrackets(){
    const [pregunta, setpregunta] = useState<MiniBrack | null> (null);
    const [daysLeft, setDaysLeft] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleVoteClick = () => {
    if (!pregunta) return;

    navigate(`/brackets?pregunta_id=${pregunta.id}`);
  };

    useEffect(() => {
        const loadPregunta = async () => {
            try {
                const data = await getMiniBracket();
                setpregunta(data);
                setDaysLeft(getDaysLeft(data));
            } catch (err) {
                console.error(err)
            }
        }
        loadPregunta();
    },[]);
    return(
    <div className="self-stretch p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/25 inline-flex flex-col justify-start items-start gap-7 overflow-hidden">
        <div className="self-stretch inline-flex justify-between items-center">
            <h2 className="justify-start text-purple-900 text-3xl font-medium font-['Graphik']">Time to vote</h2>
            <div className="px-2.5 py-[5px] bg-yellow-700 rounded-[10px] flex justify-center items-center gap-2.5 overflow-hidden">
                <h5 className="justify-start text-white text-xl font-normal font-['Graphik']">{daysLeft}</h5>
            </div>
        </div>
        <div className="self-stretch p-3.5 bg-zinc-100 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/25 flex flex-col justify-start items-start gap-7">
            <h1 className="self-stretch text-center justify-start text-violet-950 text-4xl font-black font-['Graphik']title1">{pregunta?.question}</h1>
          <button type="button" onClick={handleVoteClick} disabled={!pregunta} data-property-1="Default"
            className="self-stretch px-5 py-3 bg-purple-900 rounded-2xl inline-flex justify-center items-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-60">
                <h1 className="justify-start text-zinc-100 text-3xl font-medium font-['Graphik']title1">Vote now</h1>
          </button>
        </div>
    </div>
    )
}

export default MiniBrackets;