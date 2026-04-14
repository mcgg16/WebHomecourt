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
    .is('winner', null)
    .order('open_date', { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    throw new Error("Failed to get minibrackets");
  }

  const now = new Date();

  // Filtra en el cliente para evitar problemas de timezone
  const active = (data as MiniBrack[]).find(b => 
    new Date(b.open_date) <= now && new Date(b.close_date) >= now
  );

  if (!active) throw new Error("No active bracket found");

  return active;
}

function MiniBrackets(){
    const [pregunta, setpregunta] = useState<MiniBrack | null> (null);
    const [daysLeft, setDaysLeft] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        } finally {
          setIsLoading(false)
            }
        }
        loadPregunta();
    },[]);

    if (isLoading) return null;

    return(
    <div className="self-stretch p-4 md:p-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/25 inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
        <div className="self-stretch inline-flex justify-between items-center">
        <h2 className="justify-start text-purple-900 text-xl md:text-2xl font-medium font-['Graphik']">Time to vote</h2>
        <div className="px-2 py-1 bg-yellow-700 rounded-[10px] flex justify-center items-center gap-2 overflow-hidden">
          <h5 className="justify-start text-white text-sm md:text-base font-normal font-['Graphik']">{daysLeft}</h5>
            </div>
        </div>
      <div className="self-stretch p-3 bg-zinc-100 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/25 flex flex-col justify-start items-start gap-5">
        <h1 className="self-stretch text-center justify-start text-violet-950 text-2xl md:text-3xl font-black font-['Graphik']title1">{pregunta?.question}</h1>
          <button type="button" onClick={handleVoteClick} disabled={!pregunta} data-property-1="Default"
        className="self-stretch px-4 py-2.5 bg-purple-900 rounded-2xl inline-flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
          <h1 className="justify-start text-zinc-100 text-xl md:text-2xl font-medium font-['Graphik']title1">Vote now</h1>
          </button>
        </div>
    </div>
    )
}

export default MiniBrackets;