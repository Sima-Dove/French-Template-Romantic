import {
  ArrowLeft,
  ArrowRight,
  Bird,
  BookOpen,
  Check,
  Coffee,
  Feather,
  Flower2,
  Headphones,
  Leaf,
  MessageCircle,
  Mic2,
  PenLine,
  RotateCcw,
  Sparkles,
  Sun,
  Volume2,
} from 'lucide-react';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';

type Pillar = 'Vocabulaire' | 'Grammaire' | 'Pratique';
type FieldSetter = (value: string) => void;

const colors = {
  terracotta: '#ad6d5b',
  sage: '#869786',
  gold: '#b99559',
  charcoal: '#403a35',
  paper: '#f6f0e5',
  cream: '#fbf8f1',
};

const pageNames = [
  'Accueil', 'Soft Start', 'Low-spoon', 'Brain dump', 'Focus', 'Micro-habits',
  'Articles', 'Faux amis', 'Phrasebook', 'Rose · Bud · Thorn', 'Mes progrès',
  'Notes', 'Flashcards', 'Rituel', 'Reset', 'Au revoir',
];

const activities = [
  { title: 'Une chanson française', detail: 'Écouter un refrain et repérer trois mots.', icon: Volume2 },
  { title: 'Un café avec un mot', detail: 'Apprendre le nom de ce que tu bois.', icon: Coffee },
  { title: 'Une mini vidéo', detail: 'Regarder 5 minutes, sans sous-titres si possible.', icon: Headphones },
  { title: 'Une phrase à voix haute', detail: 'La dire trois fois avec douceur.', icon: Mic2 },
  { title: 'Un petit mot doux', detail: 'Écrire un SMS imaginaire en français.', icon: MessageCircle },
];

const energyTiers = [
  { label: 'High Energy Day', subtitle: "J’ai de l’élan", color: '#d9e0d3', items: ['20 min de grammaire', '10 mots dans une phrase', '10 min de conversation'] },
  { label: 'Medium Energy Day', subtitle: 'Je peux faire un peu', color: '#ead4ca', items: ['Réviser 5 cartes', 'Lire un paragraphe', 'Répéter une phrase'] },
  { label: 'Low Energy Day', subtitle: 'Je me garde proche du français', color: '#eee5d3', items: ['Écouter une chanson', 'Dire bonjour à voix haute', 'Ouvrir le planner'] },
];
const falseFriends = [['actuellement', 'currently', 'actually'], ['attendre', 'to wait', 'to attend'], ['librairie', 'bookshop', 'library'], ['sensible', 'sensitive', 'sensible'], ['une journée', 'a day', 'a journey']];
const phrases = [['Bref', 'Anyway / in short', 'Bref, on recommence demain.'], ['Du coup', 'So / as a result', 'Du coup, je prends un café.'], ['En fait', 'Actually / in fact', 'En fait, j’aime bien ça.'], ['Franchement', 'Honestly', 'Franchement, c’était délicieux.'], ['Voilà', 'There you go / that’s it', 'Voilà, c’est tout pour aujourd’hui.']];

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function DoveLogo({ size = 32, strokeWidth = 1.8, style, className }: { size?: number; strokeWidth?: number; style?: CSSProperties; className?: string }) {
  return (
    <svg aria-label="Sima Studio dove" role="img" viewBox="0 0 100 70" width={size * 1.36} height={size} className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 52C56 44 60 38 62 31C65 22 72 15 80 14C87 13 92 16 97 20C92 20 88 22 85 27C82 33 83 40 79 47C75 54 67 57 57 59" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 35C55 29 48 25 42 20C35 15 31 10 32 6C34 1 40 1 46 3C58 7 64 17 63 27C63 32 60 37 56 42" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M47 40C37 34 24 22 12 9C9 6 6 8 7 14C9 26 17 36 29 41C36 44 42 44 47 42" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43 43C31 38 19 35 12 38C8 40 10 45 14 49C21 56 32 58 41 52C45 49 47 46 49 42" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 49C34 51 29 56 32 59C35 62 41 59 47 53" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 20C86 23 89 23 91 20" stroke="currentColor" strokeWidth={Math.max(1, strokeWidth * 0.8)} strokeLinecap="round" />
    </svg>
  );
}

function SectionLabel({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return <div className="planner-section-label">{eyebrow && <div className="planner-eyebrow"><span />{eyebrow}</div>}<h2>{children}</h2></div>;
}

function PaperNote({ children, className, tint = colors.cream }: { children: ReactNode; className?: string; tint?: string }) {
  return <div className={cn('planner-note', className)} style={{ backgroundColor: tint }}>{children}</div>;
}

function RuledArea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: FieldSetter; placeholder: string; rows?: number }) {
  return <textarea data-testid="textarea-ruled" value={value} rows={rows} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="planner-ruled" />;
}

function CheckRow({ label, checked, onChange, compact = false }: { label: string; checked: boolean; onChange: () => void; compact?: boolean }) {
  return (
    <button data-testid={`button-check-${label.replace(/\W+/g, '-').toLowerCase()}`} type="button" onClick={onChange} className={cn('planner-check-row', compact && 'compact')} style={{ color: checked ? colors.sage : colors.charcoal }} aria-pressed={checked}>
      <span className={cn('planner-check', checked && 'checked')}>{checked && <Check size={compact ? 10 : 12} strokeWidth={2.5} />}</span>
      <span className={checked ? 'line-through decoration-[#ad6d5b]/60' : ''}>{label}</span>
    </button>
  );
}

function PagePaper({ children, page }: { children: ReactNode; page: number }) {
  return <main className="planner-paper" aria-label={`Page ${page + 1} sur 16`}><div className="planner-page-number">{String(page + 1).padStart(2, '0')} / 16</div><div className="relative z-10">{children}</div></main>;
}

function MiniKey({ icon: Icon, label }: { icon: typeof Leaf; label: string }) {
  return <span className="planner-mini-key"><Icon size={13} strokeWidth={1.5} /> {label}</span>;
}

function Wreath({ leaves, toggle }: { leaves: boolean[]; toggle: (index: number) => void }) {
  return (
    <div className="planner-wreath">
      <svg viewBox="0 0 340 340" aria-label="Couronne de progrès, chaque feuille est activable" role="img">
        <path d="M95 293 C24 244 19 113 104 48" fill="none" stroke="#9eaf9c" strokeWidth="4" strokeLinecap="round" />
        <path d="M245 293 C316 244 321 113 236 48" fill="none" stroke="#9eaf9c" strokeWidth="4" strokeLinecap="round" />
        <path d="M104 48 C155 18 187 18 236 48" fill="none" stroke="#c6a06a" strokeWidth="2" strokeDasharray="2 9" />
        {Array.from({ length: 9 }, (_, index) => {
          const left = index < 5; const x = left ? 73 + index * 5 : 267 - (index - 5) * 5; const y = 246 - (index % 5) * 41; const rotate = left ? -38 + index * 3 : 38 - (index - 5) * 3;
          return <path data-testid={`button-leaf-${index}`} role="button" tabIndex={0} key={index} d={`M${x} ${y} C${x - 20} ${y - 18} ${x - 24} ${y + 14} ${x} ${y + 8} C${x + 22} ${y + 2} ${x + 18} ${y - 12} ${x} ${y}Z`} fill={leaves[index] ? colors.terracotta : '#d4ded0'} opacity=".9" transform={`rotate(${rotate} ${x} ${y})`} onClick={() => toggle(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(index); } }} />;
        })}
      </svg>
      <div className="planner-wreath-center"><DoveLogo size={24} strokeWidth={1.35} style={{ color: colors.terracotta }} /><span>Mes progrès</span><small>Chaque petite feuille compte.</small></div>
      <div className="planner-wreath-hint">clique les feuilles</div>
    </div>
  );
}

export function FrenchLearnerPlanner() {
  const [page, setPage] = useState(0);
  const [owner, setOwner] = useState('');
  const [motivation, setMotivation] = useState('');
  const [brainDump, setBrainDump] = useState('');
  const [concept, setConcept] = useState('');
  const [phrase, setPhrase] = useState('');
  const [rose, setRose] = useState('');
  const [bud, setBud] = useState('');
  const [thorn, setThorn] = useState('');
  const [notes, setNotes] = useState('');
  const [need, setNeed] = useState('');
  const [activeEnergy, setActiveEnergy] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [habitCells, setHabitCells] = useState<Record<string, boolean>>({});
  const [leaves, setLeaves] = useState<boolean[]>(Array(9).fill(false));
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [vocab, setVocab] = useState(Array.from({ length: 5 }, (_, index) => ({ word: index === 0 ? 'la douceur' : '', gender: index === 0 ? 'f' : '', meaning: index === 0 ? 'gentleness' : '' })));
  const [ritual, setRitual] = useState<Record<string, string>>({});
  const progress = useMemo(() => leaves.filter(Boolean).length, [leaves]);
  const toggle = (key: string) => setChecked((current) => ({ ...current, [key]: !current[key] }));
  const updateVocab = (index: number, key: 'word' | 'gender' | 'meaning', value: string) => setVocab((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row));
  const input = (key: string, placeholder: string) => <input data-testid={`input-${key}`} value={ritual[key] || ''} onChange={(event) => setRitual((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} className="planner-line-input" />;

  const renderPage = () => {
    switch (page) {
      case 0: return <PagePaper page={page}><div className="planner-cover-grid"><div className="planner-cover-copy"><div className="planner-kicker"><DoveLogo size={18} strokeWidth={1.45} /> un planner sans pression</div><h1>The Romantic <em>French Learner’s</em> Planner</h1><p className="planner-tagline">Le français, doucement</p><div className="planner-cover-fields"><label>Ce planner appartient à<input data-testid="input-owner" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="ton prénom" /></label><label>Pourquoi j’apprends le français<textarea data-testid="textarea-motivation" value={motivation} onChange={(event) => setMotivation(event.target.value)} rows={2} placeholder="Une raison qui te ressemble…" /></label></div></div><div className="planner-cover-image"><div /><img src="/images/4292562141503357.jpg" alt="L’Arc de Triomphe à Paris au coucher du soleil" /><span><DoveLogo size={30} strokeWidth={1.35} /></span></div></div></PagePaper>;
      case 1: return <PagePaper page={page}><SectionLabel eyebrow="01 · commencer tout doucement">Soft Start</SectionLabel><div className="planner-intro-row"><p>Le meilleur plan est celui qui te donne envie d’ouvrir la page. Choisis une seule porte d’entrée.</p><MiniKey icon={Sparkles} label="moins, mais mieux" /></div><div className="planner-activity-grid">{activities.map((activity, index) => { const Icon = activity.icon; const active = selectedActivity === index; return <button data-testid={`button-activity-${index}`} type="button" key={activity.title} onClick={() => setSelectedActivity(active ? null : index)} className={cn('planner-activity', active && 'active')}><Icon size={22} strokeWidth={1.3} /><strong>{activity.title}</strong><small>{activity.detail}</small><span>{active ? 'choisi pour aujourd’hui' : 'choisir'}</span></button>; })}</div><PaperNote tint="#e0e7dc" className="planner-note-inline"><Feather size={24} /><p><strong>Le but n’est pas de tout faire.</strong> Le but est de rester en lien.</p></PaperNote></PagePaper>;
      case 2: return <PagePaper page={page}><SectionLabel eyebrow="02 · écouter son énergie">Low-Spoon Study Guide</SectionLabel><p className="planner-lede">Tous les jours n’ont pas la même forme. Ici, chaque niveau d’énergie mérite une vraie façon d’apprendre.</p><div className="planner-energy-list">{energyTiers.map((tier, index) => <button data-testid={`button-energy-${index}`} type="button" key={tier.label} onClick={() => setActiveEnergy(index)} className={cn('planner-energy', activeEnergy === index && 'active')} style={{ '--tier-color': tier.color } as CSSProperties}><div><strong>{tier.label}</strong>{activeEnergy === index && <span>mon choix</span>}<small>{tier.subtitle}</small></div><div className="planner-energy-items">{tier.items.map((item) => <small key={item}>• {item}</small>)}</div></button>)}</div><div className="planner-two-notes"><PaperNote tint="#f2e2d9"><i>Permission de faire petit.</i><p>Même cinq minutes comptent comme une rencontre avec la langue.</p></PaperNote><PaperNote tint="#e1e9dd"><i>Aujourd’hui, j’ai besoin de…</i><input data-testid="input-need" value={need} onChange={(event) => setNeed(event.target.value)} placeholder="du calme, du jeu, de la clarté…" className="planner-line-input" /></PaperNote></div></PagePaper>;
      case 3: return <PagePaper page={page}><SectionLabel eyebrow="03 · déposer ce qui pèse">Vider mon cerveau</SectionLabel><p className="planner-lede">Tout ce qui tourne dans ta tête peut atterrir ici. Pas besoin que ce soit joli.</p><PaperNote className="planner-dump"><RuledArea value={brainDump} onChange={setBrainDump} rows={8} placeholder="Mots à revoir, pensées, rendez-vous, envies, questions…" /></PaperNote><div className="planner-three-notes">{['À garder en tête', 'À remettre à plus tard', 'Une chose à célébrer'].map((label, index) => <label key={label} className={index === 2 ? 'sage-note' : ''}>{label}<input data-testid={`input-dump-${index}`} placeholder="écrire ici…" className="planner-line-input" /></label>)}</div></PagePaper>;
      case 4: return <PagePaper page={page}><SectionLabel eyebrow="04 · la semaine en trois respirations">Focus de la semaine</SectionLabel><p className="planner-lede">Pas une liste infinie : trois petits piliers qui peuvent vraiment tenir dans ta semaine.</p><div className="planner-focus-grid"><PaperNote tint="#e3e9df"><h3><BookOpen size={20} /> Vocabulaire</h3><p>10 mots maximum · choisis des mots vivants.</p><div className="vocab-header"><span>mot</span><span>genre</span><span>sens</span></div>{vocab.map((row, index) => <div className="vocab-row" key={index}><input data-testid={`input-vocab-word-${index}`} value={row.word} onChange={(event) => updateVocab(index, 'word', event.target.value)} placeholder="mot" /><input data-testid={`input-vocab-gender-${index}`} value={row.gender} onChange={(event) => updateVocab(index, 'gender', event.target.value)} placeholder="—" /><input data-testid={`input-vocab-meaning-${index}`} value={row.meaning} onChange={(event) => updateVocab(index, 'meaning', event.target.value)} placeholder="meaning" /></div>)}</PaperNote><PaperNote tint="#f1e1d9"><h3><PenLine size={20} /> Grammaire</h3><p>Un seul concept, observé avec attention.</p><input data-testid="input-concept" value={concept} onChange={(event) => setConcept(event.target.value)} placeholder="ex. le passé composé" className="planner-line-input large" /><label className="planner-sub-label">ma phrase exemple<input data-testid="input-example" placeholder="Je…" className="planner-line-input" /></label></PaperNote><PaperNote tint="#f0eadb"><h3><Mic2 size={20} /> Pratique</h3><p>Une case suffit. Deux, c’est un cadeau.</p>{[['Parler', 'dire une phrase'], ['Écouter', 'un extrait'], ['Lire', 'un paragraphe'], ['Écrire', 'trois lignes']].map(([label, detail]) => <CheckRow key={label} label={`${label} · ${detail}`} checked={Boolean(checked[`practice-${label}`])} onChange={() => toggle(`practice-${label}`)} />)}</PaperNote></div></PagePaper>;
      case 5: { const habits = ['5 mots', 'Écouter', 'Parler']; return <PagePaper page={page}><SectionLabel eyebrow="05 · revenir, sans se punir">Micro-habits</SectionLabel><div className="planner-intro-row"><p>Un calendrier compact pour voir les petits retours. Clique une case quand tu as fait ton geste du jour.</p><div className="planner-keys"><MiniKey icon={Sun} label="présence" /><MiniKey icon={Leaf} label="souplesse" /><MiniKey icon={Bird} label="paix" /></div></div><PaperNote className="planner-habit-scroll"><div className="planner-habit-table"><div className="habit-grid habit-heading"><span />{Array.from({ length: 14 }, (_, index) => <span key={index}>{String(index + 1).padStart(2, '0')}</span>)}</div>{habits.map((habit, habitIndex) => <div className="habit-grid habit-line" key={habit}><span>{habit}</span>{Array.from({ length: 14 }, (_, dayIndex) => { const key = `${habitIndex}-${dayIndex}`; const active = Boolean(habitCells[key]); return <button data-testid={`button-habit-${habitIndex}-${dayIndex}`} aria-label={`${habit}, jour ${dayIndex + 1}`} type="button" key={key} onClick={() => setHabitCells((current) => ({ ...current, [key]: !current[key] }))} className={active ? 'active' : ''}>{active && (habitIndex === 2 ? <Bird size={13} /> : <Check size={13} />)}</button>; })}</div>)}</div></PaperNote><div className="planner-quote"><DoveLogo size={22} strokeWidth={1.35} /> <p>Missed a day? It’s okay. The dove represents peace, not perfection. <strong>Just start again today.</strong></p></div></PagePaper>; }
      case 6: return <PagePaper page={page}><SectionLabel eyebrow="06 · les petits mots qui aident">Gender &amp; Article Cheat Sheet</SectionLabel><div className="planner-two-notes"><PaperNote tint="#e3e9df"><h3 className="gender-title sage"><span>le</span> Souvent masculin</h3>{['-age · le voyage', '-ment · le moment', '-isme · le réalisme', '-eau · le cadeau', '-phone · le téléphone'].map((item) => <p className="cheat-row" key={item}><Leaf size={14} />{item}</p>)}</PaperNote><PaperNote tint="#f1e1d9"><h3 className="gender-title terra"><span>la</span> Souvent féminin</h3>{['-tion · la question', '-té · la liberté', '-ance · la chance', '-ette · la fourchette', '-ure · la culture'].map((item) => <p className="cheat-row" key={item}><Flower2 size={14} />{item}</p>)}</PaperNote></div><PaperNote tint="#f0eadb" className="planner-note-inline"><i>Le petit rappel</i><p>Les terminaisons sont des indices, pas des lois. Apprends chaque nom avec son article.</p><input data-testid="input-article" placeholder="un mot à ajouter…" className="planner-line-input" /></PaperNote></PagePaper>;
      case 7: return <PagePaper page={page}><SectionLabel eyebrow="07 · démêler les ressemblances">Faux amis</SectionLabel><p className="planner-lede">Les mots qui ressemblent à l’anglais aiment parfois nous faire un petit détour.</p><div className="planner-false-table"><div className="false-head"><span>mot français</span><span>ce que ça veut dire</span><span>pas…</span></div>{falseFriends.map((row, index) => <div className="false-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span></div>)}</div><div className="planner-two-notes"><label className="sage-note">mon faux ami de la semaine<input data-testid="input-false-friend" placeholder="actuellement…" className="planner-line-input" /></label><label>une phrase pour l’ancrer<input data-testid="input-false-example" placeholder="Aujourd’hui…" className="planner-line-input" /></label></div></PagePaper>;
      case 8: return <PagePaper page={page}><SectionLabel eyebrow="08 · parler comme dans la vraie vie">Inner French Phrasebook</SectionLabel><div className="planner-intro-row"><p>Des petits mots de liaison pour laisser la phrase respirer et gagner en naturel.</p><Volume2 size={28} /></div><div className="phrase-grid">{phrases.map(([word, meaning, example]) => <div className="phrase-card" key={word}><div><strong>{word}</strong><small>{meaning}</small></div><p>“{example}”</p></div>)}</div><label className="planner-day-phrase">ma phrase du jour<input data-testid="input-phrase" value={phrase} onChange={(event) => setPhrase(event.target.value)} placeholder="Du coup, …" /></label></PagePaper>;
      case 9: return <PagePaper page={page}><SectionLabel eyebrow="09 · regarder avec tendresse">Rose · Bud · Thorn</SectionLabel><p className="planner-lede">Une façon simple de tenir ensemble ce qui a fleuri, ce qui commence, et ce qui a piqué.</p><div className="planner-three-notes planner-rbt">{[['Rose', 'Ce qui m’a fait plaisir', rose, setRose, '#ead4ca'], ['Bud', 'Ce qui est en train de naître', bud, setBud, '#e1e9dd'], ['Thorn', 'Ce qui a été difficile', thorn, setThorn, '#f0eadb']].map(([title, subtitle, value, setter, tint]) => <PaperNote key={String(title)} tint={String(tint)}><h3>{String(title)}<small>{String(subtitle)}</small></h3><textarea data-testid={`textarea-${String(title).toLowerCase()}`} value={String(value)} onChange={(event) => (setter as FieldSetter)(event.target.value)} placeholder="écrire ici…" rows={6} className="planner-ruled" /></PaperNote>)}</div></PagePaper>;
      case 10: return <PagePaper page={page}><SectionLabel eyebrow="10 · voir les traces">Mes Progrès</SectionLabel><div className="planner-progress-grid"><div><p className="planner-lede">Il n’y a pas de ligne d’arrivée ici. Seulement des signes que tu reviens, encore et encore.</p><div className="planner-progress-copy"><p>{progress === 0 ? 'Une feuille pour commencer.' : `${progress} feuilles déjà en couleur.`}</p><small>Clique les feuilles du wreath pour marquer un progrès.</small></div></div><Wreath leaves={leaves} toggle={(index) => setLeaves((current) => current.map((filled, leafIndex) => leafIndex === index ? !filled : filled))} /></div><PaperNote tint="#f1e1d9" className="planner-centered-quote">“Je ne suis pas en retard. Je suis en train de devenir.”</PaperNote></PagePaper>;
      case 11: return <PagePaper page={page}><SectionLabel eyebrow="11 · laisser la page ouverte">Notes libres</SectionLabel><div className="planner-note-caption"><span /> idées, phrases, listes, dessins, rien du tout</div><PaperNote className="planner-notes-paper"><textarea data-testid="textarea-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Cette page n’a besoin de servir à rien…" /></PaperNote></PagePaper>;
      case 12: { const cards = ['la douceur', 'pourtant', 'se débrouiller', 'un détour', 'à bientôt', 'prendre son temps']; const backs = ['La douceur, c’est prendre son temps.', 'Pourtant, je continue.', 'Je me débrouille en français.', 'Un détour peut être joli.', 'À bientôt, alors.', 'Je prends mon temps.']; return <PagePaper page={page}><SectionLabel eyebrow="12 · réviser avec curiosité">Flashcards à retourner</SectionLabel><p className="planner-lede">Clique une carte pour la retourner. Devant : le mot. Derrière : une petite phrase qui lui donne une maison.</p><div className="card-grid">{cards.map((word, index) => { const isFlipped = Boolean(flipped[index]); return <button data-testid={`button-flashcard-${index}`} type="button" key={word} onClick={() => setFlipped((current) => ({ ...current, [index]: !current[index] }))} className={cn('flash-card', isFlipped && 'flipped')}><div><small>carte {String(index + 1).padStart(2, '0')}</small>{isFlipped ? <RotateCcw size={15} /> : <Sparkles size={15} />}</div><strong>{isFlipped ? backs[index] : word}</strong><span>{isFlipped ? 'retourner' : 'voir l’exemple'}</span></button>; })}</div></PagePaper>; }
      case 13: return <PagePaper page={page}><SectionLabel eyebrow="13 · transformer l’intention en rendez-vous">Mon rituel</SectionLabel><p className="planner-lede">Une petite scène répétable vaut mieux qu’un grand projet impossible.</p><div className="planner-two-notes"><PaperNote tint="#f1e1d9"><h3>Mon rendez-vous français</h3><div className="ritual-fields">{[['when', 'Quand je…'], ['where', 'Où je serai…'], ['start', 'Je commence par…'], ['end', 'Je termine par…']].map(([key, label]) => <label key={key}>{label}{input(key, 'écrire ici…')}</label>)}</div></PaperNote><PaperNote tint="#e1e9dd"><h3>La petite promesse</h3><p className="ritual-promise">Cette semaine, je n’ai pas besoin de parler parfaitement. J’ai seulement besoin de me donner une chance d’essayer.</p>{['Je prépare mon espace', 'Je choisis une activité', 'Je m’arrête avant l’épuisement'].map((item) => <CheckRow key={item} label={item} checked={Boolean(checked[`ritual-${item}`])} onChange={() => toggle(`ritual-${item}`)} />)}</PaperNote></div></PagePaper>;
      case 14: return <PagePaper page={page}><SectionLabel eyebrow="14 · quand tout devient trop">Gentle Reset</SectionLabel><div className="planner-reset"><DoveLogo size={32} strokeWidth={1.45} /><p>Respire. Le français sera encore là.</p>{['Boire un verre d’eau', 'Ouvrir une seule page', 'Lire une phrase lentement', 'Dire merci à l’effort d’aujourd’hui'].map((item, index) => <button data-testid={`button-reset-${index}`} type="button" key={item} onClick={() => toggle(`reset-${index}`)} className={checked[`reset-${index}`] ? 'done' : ''}><span>{checked[`reset-${index}`] ? <Check size={14} /> : index + 1}</span>{item}</button>)}<PaperNote tint="#f0eadb"><p>Le repos n’est pas une interruption de ton apprentissage. Il en fait partie.</p></PaperNote></div></PagePaper>;
      default: return <PagePaper page={page}><div className="planner-goodbye"><div><DoveLogo size={36} strokeWidth={1.45} /></div><p>fin de cette édition</p><h2>À bientôt.</h2><span>Tu peux revenir à n’importe quelle page. Il n’y a pas de bonne façon d’utiliser ce planner, seulement la tienne.</span><button data-testid="button-restart" type="button" onClick={() => setPage(0)}>revenir au début <RotateCcw size={14} /></button></div></PagePaper>;
    }
  };

  return (
    <div className="planner-shell">
      <div className="planner-wrap">
        <header className="planner-header"><div className="planner-brand"><div><DoveLogo size={19} strokeWidth={1.35} /></div><p>Le français, doucement<small>{owner || 'ton espace d’étude'}</small></p></div><div className="planner-counter"><span>page</span><strong>{String(page + 1).padStart(2, '0')}</strong><span>/ 16</span></div></header>
        {renderPage()}
        <nav className="planner-nav" aria-label="Navigation du planner"><button data-testid="button-previous" type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}><ArrowLeft size={14} /> précédent</button><div className="planner-dots">{pageNames.map((name, index) => <button data-testid={`button-page-${index + 1}`} type="button" key={name} onClick={() => setPage(index)} aria-label={`Aller à ${name}`} aria-current={page === index ? 'page' : undefined} className={page === index ? 'active' : ''}>{index + 1}<span>{name}</span></button>)}</div><button data-testid="button-next" type="button" onClick={() => setPage((current) => Math.min(pageNames.length - 1, current + 1))} disabled={page === pageNames.length - 1}>suivant <ArrowRight size={14} /></button><div className="planner-current-page"><span />{pageNames[page]}<span /></div></nav>
      </div>
    </div>
  );
}
