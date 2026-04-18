import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  BookOpen,
  Calculator,
  TrendingUp,
  Layers,
  Hash,
  GitBranch,
  AlertCircle,
  Menu,
  X,
  ChevronUp,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  AdditionAsMovement,
  MultiplicationAsScaling,
  NegativeTimesNegative,
  GrowthTypesRace,
  ThreeFacesOfDivision,
  NumberSystemsLadder,
  ComplexPlane,
  ExponentsAsSteps,
  LogarithmCounter,
  ModularClock,
  BuildingFloors,
  RationalDensityZoom,
  DistributivityRectangle,
  DivisionByZero,
  FractionalExponents,
  LogMultiplicationAddition,
  UnitCalculator,
  PlaceValueExploder,
  PrimeFactorTree,
  DomainBoundaryExplorer,
  DebugKit,
  InteractiveWrapper,
  ScrollSection,
  WallExperience,
  RuleBreaker,
  ToastProvider,
  JourneyMap,
  ConceptBridge,
  SectionCheckpoint,
  FunctionTransformer,
  ProportionalReasoning,
  DerivativeIntuition,
} from './components';
import './index.css';

const sections = [
  { id: 'intro', title: 'Introduction', icon: BookOpen },
  { id: 'part1', title: 'Number Systems', icon: Layers },
  { id: 'part2', title: 'Operations', icon: Calculator },
  { id: 'part3', title: 'Exponents & Logs', icon: TrendingUp },
  { id: 'part4', title: 'Growth Types', icon: TrendingUp },
  { id: 'part5', title: 'Units', icon: Hash },
  { id: 'part6', title: 'Number Bases', icon: Hash },
  { id: 'part7', title: 'Number Theory', icon: GitBranch },
  { id: 'part8', title: 'Boundaries', icon: AlertCircle },
];


const checkpointSections = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7', 'part8'] as const;

const WebGLHero = lazy(() => import('./components/WebGLHero'));
const ComplexRotationWebGL = lazy(() => import('./components/ComplexRotationWebGL'));
function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const mainRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const refreshCheckpointState = () => {
      const status: Record<string, boolean> = {};
      checkpointSections.forEach((id) => {
        const raw = localStorage.getItem(`mfp.checkpoint.${id}`);
        if (!raw) {
          status[id] = false;
          return;
        }
        try {
          const parsed = JSON.parse(raw) as boolean[];
          status[id] = Array.isArray(parsed) && parsed.length > 0 && parsed.every(Boolean);
        } catch {
          status[id] = false;
        }
      });
      setCompletedSections(status);
    };

    refreshCheckpointState();
    window.addEventListener('mfp-checkpoint-updated', refreshCheckpointState);
    return () => window.removeEventListener('mfp-checkpoint-updated', refreshCheckpointState);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = checkpointSections.filter((id) => completedSections[id]).length;
  const nextSection = checkpointSections.find((id) => !completedSections[id]);

  return (
    <ToastProvider>
    <div className="min-h-screen">
      {/* Progress bar */}
      <motion.div className="progress-bar" style={{ scaleX, transformOrigin: '0%' }} />

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-sm font-semibold gradient-text">Math First Principles</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-slate-900/95 backdrop-blur-lg md:hidden pt-16"
        >
          <nav className="p-6 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`nav-link w-full text-left text-lg ${activeSection === section.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </motion.div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 glass z-40 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="text-cyan-400" size={24} />
            <h2 className="text-lg font-bold gradient-text">Math First Principles</h2>
          </div>
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`nav-link w-full text-left ${activeSection === section.id ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{section.title}</span>
                  {completedSections[section.id] && <CheckCircle2 size={14} className="text-green-400 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main ref={mainRef} className="pt-16 md:pt-0 md:ml-64">
        <article className="essay-content py-8 md:py-16">
          <IntroSection />
          <Suspense fallback={<WebGLFallback label="Loading visual map..." />}><WebGLHero /></Suspense>
          <JourneyMap onJump={scrollToSection} />
          <LearningProgressBanner
            completed={completedCount}
            total={checkpointSections.length}
            nextSectionId={nextSection ?? null}
            onJump={scrollToSection}
          />
          <Part1Section />
          <Part2Section />
          <Part3Section />
          <Part4Section />
          <Part5Section />
          <Part6Section />
          <Part7Section />
          <Part8Section />
          <EpilogueSection />
        </article>

        <footer className="text-center py-12 px-4 border-t border-slate-800/50">
          <p className="text-slate-400">Mathematics From First Principles</p>
          <p className="text-sm text-slate-500 mt-2">
            An interactive learning experience for visual minds
          </p>
        </footer>
      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 p-3 btn-primary rounded-full shadow-lg z-30"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav">
        {sections.slice(0, 5).map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`mobile-nav-btn ${activeSection === section.id ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{section.title.split(' ')[0]}</span>
              {completedSections[section.id] && <CheckCircle2 size={12} className="text-green-400" />}
            </button>
          );
        })}
      </nav>
    </div>
    </ToastProvider>
  );
}





function LearningProgressBanner({
  completed,
  total,
  nextSectionId,
  onJump,
}: {
  completed: number;
  total: number;
  nextSectionId: string | null;
  onJump: (id: string) => void;
}) {
  const percent = Math.round((completed / total) * 100);
  return (
    <section className="learning-progress-banner">
      <div>
        <h3>Your learning arc</h3>
        <p>{completed}/{total} chapter checkpoints completed ({percent}%).</p>
      </div>
      <div className="learning-progress-bar">
        <div className="learning-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      {nextSectionId && (
        <button className="learning-progress-btn" onClick={() => onJump(nextSectionId)}>
          Continue → {sections.find(s => s.id === nextSectionId)?.title || nextSectionId}
        </button>
      )}
    </section>
  );
}

function WebGLFallback({ label }: { label: string }) {
  return (
    <div className="webgl-fallback">{label}</div>
  );
}

function IntroSection() {
  return (
    <ScrollSection id="intro" className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>MATHEMATICS FROM FIRST PRINCIPLES</h1>
        <p className="text-lg md:text-xl text-slate-400 mb-8">
          The Bulletproof Rebuild — For Visual Learners & Pattern-Seeking Minds
        </p>

        <div className="nd-hook mb-8">
          <strong>What makes this different:</strong> This isn't "here are rules, please obey."
          This is "here's the machine, here's why it behaves this way, and here's how to debug it."
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <h4 className="text-red-400 font-semibold mb-2">What you won't find:</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• "Just memorize this"</li>
              <li>• "Because I said so"</li>
              <li>• "Don't worry about why"</li>
              <li>• Tricks without understanding</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <h4 className="text-green-400 font-semibold mb-2">What you will find:</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• The actual machinery exposed</li>
              <li>• Why each part works that way</li>
              <li>• How to debug confusion</li>
              <li>• Multiple ways to see the same truth</li>
            </ul>
          </div>
        </div>

        <hr />

        <h2>Why This Approach Matters</h2>
        <p>
          The greatest mathematicians — Euclid, Newton, Euler, Gauss, Einstein — didn't memorize formulas.
          They understood <em>structures</em>. They could see why things <em>had</em> to be true.
        </p>
        <p>
          <strong>Euclid</strong> (300 BCE) built geometry from five simple axioms. Everything else followed logically.
          <strong>Newton</strong> invented calculus because he needed to describe motion — the math didn't exist, so he created it.
          <strong>Euler</strong> connected exponentials, trigonometry, and imaginary numbers into one beautiful equation (e^(iπ) + 1 = 0).
          <strong>Einstein</strong> derived relativity by taking simple principles seriously and following them to their conclusions.
        </p>
        <p className="text-slate-400">
          They weren't geniuses because they memorized more. They were geniuses because they understood <em>less</em> —
          fewer, deeper truths that unlocked everything else.
        </p>

        <div className="my-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20">
          <h3 className="text-purple-400 mb-4">The Secret: Math Is Invented, Not Discovered</h3>
          <p className="text-slate-300 mb-4">
            Here's what most math education gets wrong: it presents math as a set of eternal truths
            handed down from above. "Here's the quadratic formula. Memorize it."
          </p>
          <p className="text-slate-300 mb-4">
            But math was <em>invented by humans</em> to solve problems. Every concept exists because
            someone hit a wall and decided to build a tool to get past it:
          </p>
          <ul className="text-slate-300 space-y-2 mb-4">
            <li>• <strong>Negative numbers:</strong> Invented for accounting debts (7th century India)</li>
            <li>• <strong>Zero:</strong> Invented as a placeholder, became a number (5th century India)</li>
            <li>• <strong>Fractions:</strong> Invented for fair division (ancient Egypt)</li>
            <li>• <strong>Irrational numbers:</strong> Discovered when measuring diagonals (ancient Greece)</li>
            <li>• <strong>Imaginary numbers:</strong> Invented to solve cubic equations (16th century Italy)</li>
            <li>• <strong>Calculus:</strong> Invented to describe motion and change (17th century)</li>
          </ul>
          <p className="text-purple-300 font-medium">
            When you understand <em>why</em> each tool was invented, you understand <em>when</em> to use it.
          </p>
        </div>

        <hr />

        <h2>THESIS: Math Is a Tower of "Allowed Moves"</h2>
        <p>Think of math like a video game world with physics rules:</p>
        <ul>
          <li>Each "number system" is a world with certain allowed moves</li>
          <li>You hit a wall when a move has no valid result</li>
          <li>To continue, you "unlock a new zone" by adding new kinds of numbers</li>
        </ul>
        <p>
          <strong>That is the engine of mathematical progress:</strong> Preserve the contracts.
          Extend the world. Gain new powers.
        </p>

        <h3>Three Ways to See Any Concept</h3>
        <p className="text-slate-400 mb-4">
          Throughout this guide, we'll look at each idea from three angles:
        </p>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h4 className="text-cyan-400 font-semibold mb-2">🎨 Visual / Geometric</h4>
            <p className="text-sm text-slate-300">
              What does it look like? Can you draw it? This is how Euclid thought — shapes and constructions.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h4 className="text-purple-400 font-semibold mb-2">⚙️ Algebraic / Symbolic</h4>
            <p className="text-sm text-slate-300">
              What are the rules? What patterns hold? This is how Euler thought — manipulation and transformation.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="text-emerald-400 font-semibold mb-2">🌍 Applied / Physical</h4>
            <p className="text-sm text-slate-300">
              Where does this show up in the real world? This is how Newton thought — motion and force.
            </p>
          </div>
        </div>

        <ConceptBridge
          visual="You are navigating worlds with different allowed moves."
          formal="A number system is useful when operations stay consistent inside it."
          transfer="When confusion hits, ask: did I hit a boundary or misuse an operation?"
        />

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border-l-4 border-cyan-500">
          <h4 className="text-cyan-400 font-semibold mb-2">For Neurodivergent Learners</h4>
          <p className="text-sm text-slate-300">
            If traditional math felt like arbitrary rules without reason, you're not broken — the teaching was.
            Pattern-seeking minds need to see the <em>why</em> before the <em>how</em>. That's exactly what this guide provides.
            Every rule here exists because it <em>has to</em>, and you'll see why.
          </p>
        </div>

      </motion.div>
    </ScrollSection>
  );
}

function Part1Section() {
  return (
    <ScrollSection id="part1">
      <h2>PART ONE: The Number Systems Ladder</h2>
      <p>
        Each level of this ladder exists because <strong>someone hit a wall</strong> and decided
        to extend the system rather than accept the limitation. This is a 4,000-year story of
        human ingenuity.
      </p>

      <ConceptBridge
        visual="Treat each system like a game map with unlockable moves."
        formal="Closure + consistency determine whether an operation is valid in that map."
        transfer="When stuck, move to the smallest system extension that preserves old truths."
      />

      <InteractiveWrapper
        title="Number Systems Ladder"
        hint="Click on each level to explore what problems it solves"
        interactionType="click"
      >
        <NumberSystemsLadder />
      </InteractiveWrapper>

      <ScrollSection delay={0.1}>
        <h3>Level 1 — Natural Numbers: Counting World</h3>
        <p>
          <strong>ℕ = {'{'}0, 1, 2, 3, …{'}'}</strong> — Apples, clicks, steps. Anything you can count.
        </p>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
          <h4 className="text-emerald-400 font-semibold mb-2">Historical Origin: The First Numbers</h4>
          <p className="text-sm text-slate-300 mb-2">
            Natural numbers are humanity's oldest mathematical invention — older than writing itself.
            Tally marks on bones from 30,000 BCE show our ancestors counting.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>The Sumerians (3000 BCE)</strong> created the first number system for accounting.
            <strong>The Egyptians</strong> used hieroglyphic numerals to track harvests and build pyramids.
            <strong>The Mayans</strong> independently invented place-value notation with zero.
          </p>
          <p className="text-sm text-slate-400 italic">
            For millennia, these were the <em>only</em> numbers. Negative numbers didn't exist.
            If you owed someone 3 sheep, you didn't have "negative 3 sheep" — you had a debt,
            a social obligation, not a mathematical object.
          </p>
        </div>

        <p>
          <strong>The Wall:</strong> 3 − 5 = ? You can't have negative apples in counting-world.
        </p>

        <InteractiveWrapper
          title="Hit The Wall Yourself"
          hint="Try to remove 5 apples when you only have 3"
          interactionType="click"
        >
          <WallExperience />
        </InteractiveWrapper>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h5 className="text-emerald-400 font-semibold mb-2">What Naturals Can Do</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>✓ Add any two naturals → get a natural</li>
              <li>✓ Multiply any two naturals → get a natural</li>
              <li>✓ Compare (which is bigger?)</li>
              <li>✓ Count discrete objects</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <h5 className="text-red-400 font-semibold mb-2">What Naturals Can't Do</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>✗ Subtract larger from smaller</li>
              <li>✗ Divide without remainder</li>
              <li>✗ Represent debts or losses</li>
              <li>✗ Measure continuous quantities</li>
            </ul>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Level 2 — Integers: The Undo Button</h3>
        <p>
          <strong>ℤ = {'{'}…, −2, −1, 0, 1, 2, …{'}'}</strong> — We added "reverse gear."
        </p>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-blue-400 font-semibold mb-2">Historical Origin: Debts Become Numbers</h4>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Ancient China (200 BCE):</strong> The Nine Chapters on Mathematical Art used red rods
            for positive numbers and black rods for negative — for accounting. But they weren't considered
            "real" numbers, just bookkeeping tricks.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>India (7th century CE):</strong> Brahmagupta first treated negatives as legitimate
            numbers with arithmetic rules. He wrote: "A debt subtracted from zero is a fortune."
            This was revolutionary — debts weren't just social concepts anymore, they were mathematical objects.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Europe (16th-17th century):</strong> Mathematicians like Cardano reluctantly used
            negatives but called them "absurd" and "fictitious." It took centuries for Europeans to
            accept what Indian mathematicians knew 1,000 years earlier.
          </p>
          <p className="text-sm text-slate-400 italic">
            The resistance to negatives shows how hard it is to expand our concept of "number."
            Every extension meets skepticism until its usefulness becomes undeniable.
          </p>
        </div>

        <InteractiveWrapper
          title="Building Floors: Understanding Negatives"
          hint="Use the elevator buttons to see how negatives work as directions"
          interactionType="click"
        >
          <BuildingFloors />
        </InteractiveWrapper>

        <h4 className="mt-6">Three Ways to Understand Negatives</h4>
        <div className="grid gap-4 md:grid-cols-3 my-4">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h5 className="text-cyan-400 font-semibold mb-2">🎨 Visual: Direction</h5>
            <p className="text-sm text-slate-300">
              Negatives point the opposite way on the number line. -3 is "3 steps left."
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h5 className="text-purple-400 font-semibold mb-2">⚙️ Algebraic: Inverse</h5>
            <p className="text-sm text-slate-300">
              -a is "the number that, when added to a, gives zero." It's the additive inverse.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h5 className="text-emerald-400 font-semibold mb-2">🌍 Applied: Balance</h5>
            <p className="text-sm text-slate-300">
              Temperature below zero, floors below ground, money owed. Context where "less than nothing" makes sense.
            </p>
          </div>
        </div>

        <p>
          <strong>Key insight:</strong> Negatives aren't "less than nothing." They're <em>directions</em>.
          Once you see this, negative times negative = positive becomes obvious (two reversals = forward).
        </p>
      </ScrollSection>

      <ScrollSection delay={0.2}>
        <h3>Level 3 — Rationals: Division (Almost) Always Works</h3>
        <p>
          <strong>ℚ = {'{'}p/q : p, q ∈ ℤ, q ≠ 0{'}'}</strong> — Now 7 ÷ 3 = 7/3 has an answer.
        </p>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-yellow-500">
          <h4 className="text-yellow-400 font-semibold mb-2">Historical Origin: Fair Division</h4>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Ancient Egypt (2000 BCE):</strong> The Rhind Papyrus shows elaborate fraction
            arithmetic. Egyptians only used "unit fractions" (1/n) — to write 2/5, they'd say 1/3 + 1/15.
            This seems bizarre, but it guaranteed fair division: to split 2 loaves among 5 people,
            give each person 1/3 of a loaf and 1/15 of a loaf.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Babylon (1800 BCE):</strong> Used base-60 fractions (why we have 60 seconds in a
            minute). The first "decimal-like" system.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>India & Arabia (500-1200 CE):</strong> Developed our modern fraction notation
            and the algorithms we still use today.
          </p>
        </div>

        <InteractiveWrapper
          title="Rational Density: The √2 Gap"
          hint="Zoom in on √2 to see the 'hole' that rationals can't fill"
          interactionType="drag"
        >
          <RationalDensityZoom />
        </InteractiveWrapper>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-red-500">
          <h4 className="text-red-400 font-semibold mb-2">The Crisis: √2 Is Not a Fraction</h4>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Ancient Greece (500 BCE):</strong> The Pythagoreans believed "all is number" —
            meaning ratios of whole numbers explained everything. Then someone (possibly Hippasus)
            proved that √2 cannot be expressed as a fraction.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>The proof:</strong> Assume √2 = p/q in lowest terms. Then 2 = p²/q², so p² = 2q².
            This means p² is even, so p is even. Write p = 2k. Then 4k² = 2q², so q² = 2k².
            This means q is also even. But we said p/q was in lowest terms — contradiction!
          </p>
          <p className="text-sm text-slate-300 mb-2">
            Legend says the Pythagoreans were so disturbed by this discovery that they drowned Hippasus.
            The existence of "irrational" numbers shattered their worldview.
          </p>
          <p className="text-sm text-slate-400 italic">
            This is the first mathematical crisis: numbers exist that cannot be written as ratios.
            The number line has "gaps" between the fractions.
          </p>
        </div>

        <p>
          <strong>The Wall:</strong> Despite being infinitely dense (between any two rationals,
          there's another rational), rationals have <em>gaps</em>. √2, π, e — these cannot be fractions.
        </p>
      </ScrollSection>

      <ScrollSection delay={0.25}>
        <h3>Level 4 — Reals: No More Gaps</h3>
        <p>
          <strong>ℝ</strong> — Fills every hole. Now limits and measurement work reliably.
        </p>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-orange-500">
          <h4 className="text-orange-400 font-semibold mb-2">Historical Origin: Taming the Infinite</h4>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Ancient Greece:</strong> Eudoxus developed a theory of proportions that handled
            irrationals geometrically, without naming them as numbers. For 2,000 years, √2 was a
            <em>length</em>, not a number.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Stevin (1585):</strong> Introduced decimal notation, making irrationals look
            like regular numbers: 1.41421356... The infinite decimal expansion made irrationals
            concrete.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Dedekind (1872):</strong> Finally made real numbers rigorous using "cuts" —
            a real number is defined by the set of rationals less than it. This filled every gap.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Cantor (1874):</strong> Proved there are "more" real numbers than rationals —
            the reals are <em>uncountably</em> infinite. Mind-blowing: there are different sizes of infinity!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 my-6">
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <h5 className="text-orange-400 font-semibold mb-2">Why Reals Matter</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Measurement requires continuous values</li>
              <li>• Calculus needs limits that converge</li>
              <li>• Physics needs precise coordinates</li>
              <li>• Every point on the number line has a value</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <h5 className="text-red-400 font-semibold mb-2">The Final Wall</h5>
            <p className="text-sm text-slate-300">
              √(−1) still doesn't exist. No real number, when squared, gives a negative.
              The equation x² + 1 = 0 has no real solution.
            </p>
            <p className="text-sm text-slate-400 mt-2 italic">
              Or does it? What if we just... invented one?
            </p>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection delay={0.3}>
        <h3>Level 5 — Complex Numbers: A New Direction</h3>
        <p>
          <strong>ℂ = {'{'}a + bi{'}'} where i² = −1</strong>
        </p>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-purple-500">
          <h4 className="text-purple-400 font-semibold mb-2">Historical Origin: The "Imaginary" Numbers</h4>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Cardano (1545):</strong> While solving cubic equations, found formulas that
            required square roots of negative numbers. He called them "sophistic" and "as subtle
            as they are useless." But they gave correct real answers!
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Bombelli (1572):</strong> First to work systematically with √(-1), showing
            that these "imaginary" quantities followed consistent rules and solved real problems.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Euler (1748):</strong> Named √(-1) as "i" and discovered the stunning equation
            e^(iπ) + 1 = 0, connecting five fundamental constants.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>Gauss & Argand (early 1800s):</strong> Showed complex numbers are points on
            a <em>plane</em>. Multiplication by i is rotation by 90°. Suddenly "imaginary" became
            <em>geometric</em> — as real as any other direction.
          </p>
          <p className="text-sm text-slate-400 italic">
            The name "imaginary" is a historical accident. Complex numbers are no more fictional
            than negative numbers — which were also once called "absurd."
          </p>
        </div>

        <div className="my-6">
          <Suspense fallback={<WebGLFallback label="Loading complex rotation..." />}><ComplexRotationWebGL /></Suspense>
        </div>

        <InteractiveWrapper
          title="The Complex Plane"
          hint="Drag the point or click 'Multiply by i' to see rotation in action"
          interactionType="drag"
        >
          <ComplexPlane />
        </InteractiveWrapper>

        <h4 className="mt-6">Three Ways to Understand i</h4>
        <div className="grid gap-4 md:grid-cols-3 my-4">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h5 className="text-cyan-400 font-semibold mb-2">🎨 Visual: Rotation</h5>
            <p className="text-sm text-slate-300">
              Multiplying by i rotates a point 90° counterclockwise. Two rotations (i²) = 180° = -1.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h5 className="text-purple-400 font-semibold mb-2">⚙️ Algebraic: Closure</h5>
            <p className="text-sm text-slate-300">
              i is "the number that squares to -1." With it, every polynomial has a root (Fundamental Theorem of Algebra).
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h5 className="text-emerald-400 font-semibold mb-2">🌍 Applied: Waves</h5>
            <p className="text-sm text-slate-300">
              AC electricity, quantum physics, signal processing — all use complex numbers because rotation is fundamental.
            </p>
          </div>
        </div>

        <div className="nd-hook">
          <strong>Mind-bending insight:</strong> Multiplying by i = rotating 90°. Two rotations
          (i²) = 180° = pointing backwards = −1. That's why i² = −1!
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20">
          <h4 className="text-purple-400 font-semibold mb-2">The Punchline</h4>
          <p className="text-sm text-slate-300 mb-2">
            We now have <strong>ℂ — the algebraically closed field</strong>. Every polynomial
            equation has a solution here. Every number system we've built is contained within it:
          </p>
          <p className="text-center font-mono text-lg text-slate-300 my-4">
            ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ
          </p>
          <p className="text-sm text-slate-400 italic">
            Each extension was resisted, called "absurd" or "imaginary," then eventually accepted
            when its usefulness became undeniable. This is how mathematics grows.
          </p>
        </div>
      </ScrollSection>

      <SectionCheckpoint
        title="Part 1 checkpoint"
        sectionId="part1"
        prompts={[
          'I can explain why ℕ, ℤ, ℚ, ℝ, ℂ were introduced in sequence.',
          'I can identify when an expression hits a system boundary.',
          'I can describe i as rotation, not magic.',
          'I understand that each number system extension was historically controversial.'
        ]}
      />
    </ScrollSection>
  );
}

function Part2Section() {
  return (
    <ScrollSection id="part2">
      <h2>PART TWO: Operations as "Moves"</h2>

      <p className="text-lg text-slate-300 mb-6">
        Here's a secret that transforms how you see arithmetic: every operation is a <em>transformation</em>.
        Numbers aren't just sitting there — operations <em>do things</em> to them.
      </p>

      <ConceptBridge
        visual="Addition slides. Multiplication stretches. Division asks for the reverse stretch."
        formal="Operations are transformations with inverses and constraints."
        transfer="Use this lens in code, finance, and scaling systems: what changes linearly vs multiplicatively?"
      />

      <div className="my-8 p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/20">
        <h3 className="text-cyan-400 mb-4">The Key Insight: Operations Have Geometry</h3>
        <p className="text-slate-300 mb-4">
          This is how mathematicians from Euclid to Einstein thought about operations — not as
          abstract symbol manipulation, but as <em>physical actions</em> on space:
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Geometric Meaning</th>
                <th>Inverse</th>
                <th>What It Preserves</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Addition</td>
                <td>Slide/translate</td>
                <td>Subtraction</td>
                <td>Distances between points</td>
              </tr>
              <tr>
                <td>Multiplication</td>
                <td>Scale/stretch from origin</td>
                <td>Division</td>
                <td>Ratios between points</td>
              </tr>
              <tr>
                <td>Exponentiation</td>
                <td>Repeated scaling</td>
                <td>Logarithm</td>
                <td>Multiplicative structure</td>
              </tr>
              <tr>
                <td>Rotation (complex)</td>
                <td>Spin around origin</td>
                <td>Opposite rotation</td>
                <td>Distances from origin</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-400 text-sm mt-4 italic">
          Once you see operations as geometry, you can <em>visualize</em> algebraic manipulation.
          This is how Newton saw physics, how Einstein saw spacetime.
        </p>
      </div>

      <ScrollSection delay={0.1}>
        <h3>Addition: Moving on the Number Line</h3>

        <div className="my-4 p-4 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-blue-400 font-semibold mb-2">Historical Origin</h4>
          <p className="text-sm text-slate-300 mb-2">
            Addition is the oldest operation — cave people could combine piles of things.
            But seeing it as <em>movement</em> came later.
          </p>
          <p className="text-sm text-slate-300">
            <strong>Wallis (1655)</strong> introduced the number line. Suddenly arithmetic became geometric:
            +3 means "move right 3 units." This visualization made negative numbers intuitive —
            they're just the opposite direction.
          </p>
        </div>

        <InteractiveWrapper
          title="Addition as Movement"
          hint="Drag the slider to see how addition moves you along the number line"
          interactionType="drag"
        >
          <AdditionAsMovement />
        </InteractiveWrapper>

        <p>
          <strong>5 + 3</strong> means "start at 5, move right 3." Subtraction is just moving left.
        </p>

        <div className="grid gap-4 md:grid-cols-3 my-6">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h5 className="text-cyan-400 font-semibold mb-2">🎨 Visual</h5>
            <p className="text-sm text-slate-300">
              Addition = sliding along the number line. Direction matters (left vs right).
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h5 className="text-purple-400 font-semibold mb-2">⚙️ Algebraic</h5>
            <p className="text-sm text-slate-300">
              Addition is commutative (a+b = b+a) and associative ((a+b)+c = a+(b+c)).
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h5 className="text-emerald-400 font-semibold mb-2">🌍 Physical</h5>
            <p className="text-sm text-slate-300">
              Walking, bank deposits, combining quantities. Adding is <em>accumulating</em>.
            </p>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Multiplication: Scaling</h3>

        <div className="my-4 p-4 bg-slate-800/50 rounded-lg border-l-4 border-green-500">
          <h4 className="text-green-400 font-semibold mb-2">Historical Origin: Area to Scaling</h4>
          <p className="text-sm text-slate-300 mb-2">
            Originally, multiplication was about <em>area</em>: 3 × 4 is a rectangle with sides 3 and 4.
            This is why we call it "3 times 4" — you're laying out 3 rows of 4.
          </p>
          <p className="text-sm text-slate-300 mb-2">
            <strong>The deeper view:</strong> Multiplication is <em>scaling</em>. Multiplying by 2
            doubles everything. Multiplying by 0.5 halves everything. Multiplying by -1 flips direction.
          </p>
          <p className="text-sm text-slate-300">
            <strong>Descartes (1637)</strong> unified arithmetic and geometry, showing that multiplying
            numbers corresponds to stretching lengths. This insight is the foundation of analytic geometry.
          </p>
        </div>

        <InteractiveWrapper
          title="Multiplication as Scaling"
          hint="Drag the scale factor to stretch or shrink the number line"
          interactionType="drag"
        >
          <MultiplicationAsScaling />
        </InteractiveWrapper>

        <div className="grid gap-4 md:grid-cols-3 my-6">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h5 className="text-cyan-400 font-semibold mb-2">🎨 Visual</h5>
            <p className="text-sm text-slate-300">
              Multiplication = stretching from the origin. Factor {'>'} 1 expands; factor {'<'} 1 shrinks.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h5 className="text-purple-400 font-semibold mb-2">⚙️ Algebraic</h5>
            <p className="text-sm text-slate-300">
              Commutative, associative, and <em>distributes</em> over addition: a(b+c) = ab + ac.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h5 className="text-emerald-400 font-semibold mb-2">🌍 Physical</h5>
            <p className="text-sm text-slate-300">
              Interest rates, zoom, unit conversion. Scaling changes <em>everything proportionally</em>.
            </p>
          </div>
        </div>

        <h4>Why Negative × Negative = Positive</h4>
        <p className="text-slate-400 mb-4">
          This confuses almost everyone when first encountered. But it's not arbitrary — it's <em>required</em>
          by the laws we want multiplication to obey.
        </p>

        <InteractiveWrapper
          title="The Double Flip"
          hint="Click through to see why (−1) × (−1) must equal +1"
          interactionType="click"
        >
          <NegativeTimesNegative />
        </InteractiveWrapper>

        <div className="my-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-yellow-500">
          <h4 className="text-yellow-400 font-semibold mb-2">Three Proofs That (-1) × (-1) = 1</h4>
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <strong className="text-yellow-300">1. Pattern continuation:</strong><br />
              -1 × 3 = -3, -1 × 2 = -2, -1 × 1 = -1, -1 × 0 = 0...<br />
              Each step adds 1. So -1 × (-1) = 0 + 1 = 1.
            </div>
            <div>
              <strong className="text-yellow-300">2. Distributive law:</strong><br />
              We know 0 = (-1) × 0 = (-1) × (1 + (-1)) = (-1)(1) + (-1)(-1) = -1 + ?<br />
              For this to equal 0, the ? must be 1.
            </div>
            <div>
              <strong className="text-yellow-300">3. Geometric:</strong><br />
              Multiplying by -1 = flipping across origin. Two flips = back to start.
            </div>
          </div>
        </div>

        <p className="mt-6 text-slate-400">
          But why <em>must</em> it be this way? What if we just... decided differently?
        </p>

        <InteractiveWrapper
          title="What If We Broke This Rule?"
          hint="Choose what (−1)×(−1) should equal and see what happens"
          interactionType="click"
        >
          <RuleBreaker />
        </InteractiveWrapper>
      </ScrollSection>

      <ScrollSection delay={0.2}>
        <h3>Distributivity: The Compatibility Law</h3>
        <p>
          <strong>a(b + c) = ab + ac</strong> — Scaling a combined thing equals scaling each part.
        </p>

        <InteractiveWrapper
          title="Distributivity Rectangle"
          hint="Drag the slider to split the rectangle and see distributivity in action"
          interactionType="drag"
        >
          <DistributivityRectangle />
        </InteractiveWrapper>
      </ScrollSection>

      <ScrollSection delay={0.25}>
        <h3>Division: Three Faces, One Operation</h3>

        <InteractiveWrapper
          title="The Three Faces of Division"
          hint="Explore each tab to see division from different perspectives"
          interactionType="click"
        >
          <ThreeFacesOfDivision />
        </InteractiveWrapper>

        <h4>Why Division by Zero Is Undefined</h4>

        <InteractiveWrapper
          title="Division by Zero: The Impossible Search"
          hint="Watch the robot try (and fail) to find a number that works"
          interactionType="click"
        >
          <DivisionByZero />
        </InteractiveWrapper>
      </ScrollSection>

      <ScrollSection delay={0.3}>
        <h3>Proportional Reasoning: Constant vs Changing Rates</h3>
        <p>
          Before exponential growth, there's <em>linear</em> growth — a constant rate.
          Understanding the difference is the foundation of advanced math.
        </p>

        <InteractiveWrapper
          title="Rates and Proportions"
          hint="Explore different scenarios and watch how constant rates create straight lines"
          interactionType="drag"
        >
          <ProportionalReasoning />
        </InteractiveWrapper>
      </ScrollSection>

      <ScrollSection delay={0.35}>
        <h3>Function Transformations: Shift, Stretch, Flip</h3>
        <p>
          Every function can be transformed. Understanding <em>how</em> transformations work
          unlocks graphing, modeling, and calculus.
        </p>

        <InteractiveWrapper
          title="Transform Functions"
          hint="Adjust sliders to shift, stretch, and flip functions — watch the equation change"
          interactionType="drag"
        >
          <FunctionTransformer />
        </InteractiveWrapper>
      </ScrollSection>

      <SectionCheckpoint
        title="Part 2 checkpoint"
        sectionId="part2"
        prompts={[
          'I can distinguish shift vs scale operations visually.',
          'I can justify why division by zero fails uniqueness.',
          'I can explain distributivity in my own words.',
          'I understand why f(x+2) shifts LEFT, not right.'
        ]}
      />
    </ScrollSection>
  );
}

function Part3Section() {
  return (
    <ScrollSection id="part3">
      <h2>PART THREE: Exponents and Logarithms</h2>

      <p className="text-lg text-slate-300 mb-6">
        Exponents and logarithms are <em>inverse</em> operations — like addition/subtraction or
        multiplication/division. But they unlock something profound: they convert between
        <strong> additive</strong> and <strong>multiplicative</strong> worlds.
      </p>

      <ConceptBridge
        visual="Exponents are repeated zooms; logs count how many zooms happened."
        formal="Exponentiation and logarithms are inverse operators on positive reals."
        transfer="Use this to decode growth, sound levels, pH, and compounding timelines."
      />

      <div className="my-8 p-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-500/20">
        <h3 className="text-orange-400 mb-4">Historical Context: The Invention That Changed Science</h3>
        <p className="text-slate-300 mb-4">
          <strong>John Napier (1614):</strong> A Scottish mathematician spent 20 years creating tables
          of logarithms to help astronomers with the tedious multiplication of large numbers.
          His invention was immediately hailed as "shortening the labours" of calculation by half.
        </p>
        <p className="text-slate-300 mb-4">
          <strong>Why it mattered:</strong> Before calculators, multiplying 7-digit numbers took minutes.
          With log tables, you could look up log(a) + log(b) and convert back — reducing multiplication
          to addition. Kepler used Napier's logs to discover his laws of planetary motion.
        </p>
        <p className="text-slate-300 mb-4">
          <strong>Euler (1748):</strong> Discovered the number <em>e</em> ≈ 2.71828... as the "natural"
          base for logarithms. He showed that e^(iπ) + 1 = 0 — linking exponentials, trigonometry,
          and imaginary numbers in what's called "the most beautiful equation in mathematics."
        </p>
        <p className="text-slate-400 italic">
          The slide rule — a physical log calculator — was the engineer's essential tool until
          the 1970s. Understanding logs isn't historical curiosity; it's understanding how
          science was actually done for 350 years.
        </p>
      </div>

      <ScrollSection delay={0.1}>
        <h3>Exponents: Repeated Scaling</h3>
        <p>
          <strong>2³</strong> means: Start at 1, scale by 2, three times. 1 → 2 → 4 → 8
        </p>

        <InteractiveWrapper
          title="Exponents as Steps"
          hint="Click the step buttons to see each multiplication happen"
          interactionType="click"
        >
          <ExponentsAsSteps />
        </InteractiveWrapper>

        <div className="grid gap-4 md:grid-cols-3 my-6">
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h5 className="text-cyan-400 font-semibold mb-2">🎨 Visual</h5>
            <p className="text-sm text-slate-300">
              Exponents = repeated zooming. Each step multiplies by the base.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h5 className="text-purple-400 font-semibold mb-2">⚙️ Algebraic</h5>
            <p className="text-sm text-slate-300">
              a^m × a^n = a^(m+n). Adding exponents = multiplying values.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h5 className="text-emerald-400 font-semibold mb-2">🌍 Physical</h5>
            <p className="text-sm text-slate-300">
              Compound interest, population growth, radioactive decay. Processes that scale themselves.
            </p>
          </div>
        </div>

        <h4>Fractional Exponents = Roots</h4>
        <p className="text-slate-300 mb-4">
          <strong>a^(1/2)</strong> means: "What number, when used as a scaling factor twice, gives a?"
          This is the square root. Similarly, a^(1/3) is the cube root.
        </p>

        <div className="my-4 p-4 bg-slate-800/50 rounded-lg border-l-4 border-purple-500">
          <h5 className="text-purple-400 font-semibold mb-2">Why This Makes Sense</h5>
          <p className="text-sm text-slate-300 mb-2">
            If a^m × a^n = a^(m+n), then what should a^(1/2) × a^(1/2) equal?
          </p>
          <p className="text-sm text-slate-300 mb-2">
            By the rule: a^(1/2 + 1/2) = a^1 = a
          </p>
          <p className="text-sm text-slate-300">
            So a^(1/2) must be the number that, multiplied by itself, gives a. That's √a.
          </p>
        </div>

        <InteractiveWrapper
          title="Fractional Exponents: Finding Roots"
          hint="Watch the binary search find the exact root"
          interactionType="click"
        >
          <FractionalExponents />
        </InteractiveWrapper>

        <h4 className="mt-8">Negative Exponents = Reciprocals</h4>
        <p className="text-slate-300 mb-4">
          <strong>a^(-1)</strong> = 1/a. Why? Because a^1 × a^(-1) should equal a^(1-1) = a^0 = 1.
          The only way that works is if a^(-1) = 1/a.
        </p>
        <p className="text-slate-400">
          This is the power of mathematical consistency: we don't <em>define</em> fractional and
          negative exponents arbitrarily. We ask "what must they be for the rules to stay consistent?"
        </p>
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Logarithms: Counting the Scalings</h3>
        <p>
          If exponents are "do repeated scaling," logs ask <strong>"how many times?"</strong>
        </p>

        <div className="my-4 p-4 bg-slate-800/50 rounded-lg border-l-4 border-orange-500">
          <h5 className="text-orange-400 font-semibold mb-2">The Question Logs Answer</h5>
          <p className="text-sm text-slate-300">
            "2 to what power gives 8?" Answer: 3. We write log₂(8) = 3.
          </p>
          <p className="text-sm text-slate-300 mt-2">
            "10 to what power gives 1000?" Answer: 3. We write log₁₀(1000) = 3.
          </p>
          <p className="text-sm text-slate-300 mt-2">
            "e to what power gives 7.389...?" Answer: 2. We write ln(7.389) = 2.
          </p>
        </div>

        <InteractiveWrapper
          title="Logarithm Counter"
          hint="Enter a number to see how many times you divide to reach 1"
          interactionType="input"
        >
          <LogarithmCounter />
        </InteractiveWrapper>

        <h4>The Magic: Logs Turn Multiplication into Addition</h4>
        <p className="text-slate-300 mb-4">
          This is why Napier's invention was revolutionary:
        </p>
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-center text-lg mb-4">
          <span className="text-orange-400">log(a × b)</span> = <span className="text-cyan-400">log(a)</span> + <span className="text-cyan-400">log(b)</span>
        </div>
        <p className="text-slate-400 mb-4">
          To multiply big numbers: find their logs, add (easy!), then convert back.
          You've turned hard multiplication into easy addition.
        </p>

        <InteractiveWrapper
          title="Log Property Visualizer"
          hint="Adjust the values to see how log(a×b) = log(a) + log(b)"
          interactionType="drag"
        >
          <LogMultiplicationAddition />
        </InteractiveWrapper>

        <h4 className="mt-8">The Natural Log and the Number e</h4>
        <div className="my-4 p-4 bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
          <h5 className="text-emerald-400 font-semibold mb-2">Why e ≈ 2.71828...?</h5>
          <p className="text-sm text-slate-300 mb-2">
            Imagine compound interest. If you earn 100% per year, compounded:
          </p>
          <ul className="text-sm text-slate-300 space-y-1 mb-2">
            <li>• Once per year: $1 → $2.00</li>
            <li>• Twice per year (50% each): $1 → $2.25</li>
            <li>• Monthly (8.33% each): $1 → $2.61...</li>
            <li>• Daily: $1 → $2.714...</li>
            <li>• Continuously: $1 → <strong>e ≈ $2.71828...</strong></li>
          </ul>
          <p className="text-sm text-slate-300">
            The number e emerges naturally from continuous compounding. It's the base where
            <strong> the derivative of e^x is exactly e^x</strong> — growth proportional to current size.
          </p>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20">
          <h4 className="text-purple-400 font-semibold mb-2">Euler's Identity: The Most Beautiful Equation</h4>
          <p className="text-center font-mono text-2xl text-slate-200 my-4">
            e^(iπ) + 1 = 0
          </p>
          <p className="text-sm text-slate-300">
            This single equation connects the five most important constants in mathematics:
            <strong className="text-cyan-400"> e</strong> (natural growth),
            <strong className="text-purple-400"> i</strong> (rotation),
            <strong className="text-emerald-400"> π</strong> (circles),
            <strong className="text-yellow-400"> 1</strong> (multiplication identity),
            <strong className="text-slate-400"> 0</strong> (addition identity).
          </p>
          <p className="text-sm text-slate-400 mt-2 italic">
            That these five constants combine so simply suggests deep structure in mathematics
            that we're only beginning to understand.
          </p>
        </div>
      </ScrollSection>

      <SectionCheckpoint
        title="Part 3 checkpoint"
        sectionId="part3"
        prompts={[
          'I can move between exponent and log viewpoints.',
          'I can test whether a log input is valid.',
          'I can explain fractional exponents as root-questions.',
          'I understand why logs convert multiplication to addition.',
          'I can explain what makes e special.'
        ]}
      />
    </ScrollSection>
  );
}

function Part4Section() {
  return (
    <ScrollSection id="part4">
      <h2>PART FOUR: Growth Types</h2>

      <ConceptBridge
        visual="Race the curves to feel when one trend overtakes another."
        formal="Asymptotic behavior decides long-run dominance."
        transfer="Predict workload, costs, and risk by classifying growth type early."
      />
      <p>
        This section tells you whether something will <strong>stay stable, creep up, or explode</strong>.
      </p>

      <InteractiveWrapper
        title="Growth Types Race"
        hint="Click Play to watch linear, polynomial, and exponential growth compete"
        interactionType="click"
      >
        <GrowthTypesRace />
      </InteractiveWrapper>

      <div className="grid gap-4 md:grid-cols-3 my-8">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <h4 className="text-blue-400 font-semibold">Linear</h4>
          <p className="text-sm text-slate-300">+10 each step</p>
          <p className="text-xs text-slate-500">Predictable, budgetable</p>
        </div>
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <h4 className="text-yellow-400 font-semibold">Polynomial</h4>
          <p className="text-sm text-slate-300">1, 4, 9, 16, 25…</p>
          <p className="text-xs text-slate-500">Accelerates then stabilizes</p>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h4 className="text-red-400 font-semibold">Exponential</h4>
          <p className="text-sm text-slate-300">×2 each step</p>
          <p className="text-xs text-slate-500">Looks cute at first, then explodes</p>
        </div>
      </div>

      <div className="nd-hook">
        <strong>Rule of thumb:</strong> Linear = manageable. Polynomial = manageable with effort.
        Exponential = you're on a timer.
      </div>

      <ScrollSection delay={0.2}>
        <h3>The Derivative: Measuring Change Itself</h3>
        <p>
          Knowing the growth <em>type</em> isn't enough — you need to know the <em>rate</em> at each moment.
          This is the derivative: the speedometer of mathematics.
        </p>

        <InteractiveWrapper
          title="Derivative Intuition"
          hint="Drag along the curve to see how the slope (rate of change) varies"
          interactionType="drag"
        >
          <DerivativeIntuition />
        </InteractiveWrapper>

        <p className="text-slate-400 mt-4">
          <strong>Historical note:</strong> Newton and Leibniz invented calculus in the 1680s
          to answer exactly this question: "How fast is this changing <em>right now</em>?"
          The derivative is the foundation of modern physics, engineering, and machine learning.
        </p>
      </ScrollSection>

      <SectionCheckpoint
        title="Part 4 checkpoint"
        sectionId="part4"
        prompts={[
          'I can classify a growth pattern by its long-run behavior.',
          'I can articulate why exponential growth becomes dominant.',
          'I can connect growth type to practical risk.',
          'I understand that the derivative measures instantaneous rate of change.'
        ]}
      />
    </ScrollSection>
  );
}

function Part5Section() {
  return (
    <ScrollSection id="part5">
      <h2>PART FIVE: Units as Type Labels</h2>

      <ConceptBridge
        visual="Units are colored tags attached to numbers."
        formal="Dimensional consistency is a non-negotiable equation invariant."
        transfer="Treat units like type safety to catch bugs before computation."
      />
      <p>
        If you like <strong>type systems</strong> in programming, units are exactly that.
      </p>

      <InteractiveWrapper
        title="Unit Calculator"
        hint="Enter quantities with units and see how they combine"
        interactionType="input"
      >
        <UnitCalculator />
      </InteractiveWrapper>

      <div className="nd-hook">
        <strong>Dimensional Analysis = Built-In Error Checking:</strong> If units don't match on
        both sides of an equation, something is wrong — before you even compute!
      </div>
      <SectionCheckpoint
        title="Part 5 checkpoint"
        sectionId="part5"
        prompts={[
          'I can detect unit/type mismatches quickly.',
          'I can track unit cancellation through multiplication/division.',
          'I can use dimensional analysis as pre-check.'
        ]}
      />
    </ScrollSection>
  );
}

function Part6Section() {
  return (
    <ScrollSection id="part6">
      <h2>PART SIX: Number Bases</h2>

      <ConceptBridge
        visual="A number is stacked place-value blocks in whatever base you choose."
        formal="Representation changes with base; value does not."
        transfer="Read binary/hex and data encodings without mysticism."
      />
      <p>
        <strong>3456 in base 10</strong> = 3×10³ + 4×10² + 5×10¹ + 6×10⁰
      </p>

      <InteractiveWrapper
        title="Place Value Exploder"
        hint="Enter a number and choose a base to see its place value breakdown"
        interactionType="input"
      >
        <PlaceValueExploder />
      </InteractiveWrapper>

      <p>
        <strong>Why base 10?</strong> You have 10 fingers. That's it. Any base works mathematically.
      </p>
      <SectionCheckpoint
        title="Part 6 checkpoint"
        sectionId="part6"
        prompts={[
          'I can rewrite a value in another base without changing value.',
          'I can explain place-value expansion clearly.',
          'I can read positional notation as weighted sum.'
        ]}
      />
    </ScrollSection>
  );
}

function Part7Section() {
  return (
    <ScrollSection id="part7">
      <h2>PART SEVEN: Number Theory</h2>

      <ConceptBridge
        visual="Primes are atoms; modular arithmetic wraps the number line into loops."
        formal="Unique factorization and congruence classes structure integer behavior."
        transfer="This is the backbone of cryptography, checksums, and scheduling cycles."
      />

      <ScrollSection delay={0.1}>
        <h3>Primes: The Atoms of Multiplication</h3>
        <p>
          <strong>Fundamental Theorem of Arithmetic:</strong> Every integer {'>'} 1 factors
          <em> uniquely</em> into primes.
        </p>

        <InteractiveWrapper
          title="Prime Factorization Tree"
          hint="Enter a number and click to factor it step by step"
          interactionType="click"
        >
          <PrimeFactorTree />
        </InteractiveWrapper>
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Modular Arithmetic: Clock Math</h3>
        <p>
          Working "mod 12" means numbers wrap: <strong>14 ≡ 2 (mod 12)</strong>
        </p>

        <InteractiveWrapper
          title="Modular Arithmetic Clock"
          hint="Change the modulus and value to see how numbers wrap around"
          interactionType="drag"
        >
          <ModularClock />
        </InteractiveWrapper>

        <div className="nd-hook">
          <strong>Where this shows up:</strong> Error checking (ISBN, credit cards), cryptography,
          scheduling, anything that cycles.
        </div>
      </ScrollSection>
      <SectionCheckpoint
        title="Part 7 checkpoint"
        sectionId="part7"
        prompts={[
          'I can factor numbers into primes methodically.',
          'I can reason with modular wrap-around.',
          'I can identify where modular arithmetic appears in real systems.'
        ]}
      />
    </ScrollSection>
  );
}

function Part8Section() {
  return (
    <ScrollSection id="part8">
      <h2>PART EIGHT: Domain Boundaries</h2>

      <ConceptBridge
        visual="Boundaries are cliffs in the operation landscape."
        formal="Domain restrictions define where a function is valid."
        transfer="Boundary awareness prevents silent errors in modeling and code."
      />
      <p>
        <strong>Boundaries are not embarrassing. They're the truth serum.</strong>
      </p>
      <p>
        Every system has places where operations don't work. Knowing these tells you what world
        you're in.
      </p>

      <InteractiveWrapper
        title="Domain Boundary Explorer"
        hint="Explore different operations to see where they break down"
        interactionType="explore"
      >
        <DomainBoundaryExplorer />
      </InteractiveWrapper>
      <SectionCheckpoint
        title="Part 8 checkpoint"
        sectionId="part8"
        prompts={[
          'I can test whether an operation is outside its domain.',
          'I can treat undefined as a model signal, not personal failure.',
          'I can choose a better world/model when boundaries appear.'
        ]}
      />
    </ScrollSection>
  );
}

function EpilogueSection() {
  return (
    <ScrollSection id="epilogue" className="mt-16">
      <h2>EPILOGUE: The Load-Bearing Walls</h2>

      <div className="space-y-4 mb-8">
        {[
          'Math grows by extending worlds without breaking old contracts.',
          'Addition is moving; multiplication is scaling.',
          'Subtraction/division/logs are "solve the inverse problem."',
          'Distributivity makes algebra possible.',
          "Boundaries show you what kind of world you're in.",
          'Units are a type system that prevents nonsense.',
          'Growth types predict stability vs. explosion.',
        ].map((point, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex gap-3 items-start"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
              {i + 1}
            </span>
            <p className="text-slate-300 pt-1">{point}</p>
          </motion.div>
        ))}
      </div>

      <hr />

      <h2>Debug Kit</h2>
      <p>When math feels slippery, run these checks:</p>

      <InteractiveWrapper
        title="Math Debug Kit"
        hint="Use this flowchart when you're stuck on a problem"
        interactionType="explore"
      >
        <DebugKit />
      </InteractiveWrapper>

      <hr />

      <h3>What Comes Next</h3>
      <ul>
        <li>
          <strong>Functions:</strong> Input → transformation → output
        </li>
        <li>
          <strong>Matrices:</strong> Scaling + rotating where order matters
        </li>
        <li>
          <strong>Calculus:</strong> What happens at infinitely small scales
        </li>
        <li>
          <strong>Abstract algebra:</strong> Generalizing these structures
        </li>
      </ul>

      <p className="text-center text-slate-500 text-lg py-12">
        <strong>— End —</strong>
      </p>
    </ScrollSection>
  );
}

export default App;
