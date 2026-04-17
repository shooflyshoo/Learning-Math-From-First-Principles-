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
  TransferChallenge,
  UnitCancellationFlow,
  BasePlaceValueStory,
  DomainHeatmap,
  OperationMachine,
  LogScaleBridge,
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
const GrowthCurvesWebGL = lazy(() => import('./components/GrowthCurvesWebGL'));
const ModularWrapWebGL = lazy(() => import('./components/ModularWrapWebGL'));
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

      <StoryGuideBar
        activeSection={activeSection}
        completed={completedCount}
        total={checkpointSections.length}
        onJump={scrollToSection}
      />

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







function StoryGuideBar({
  activeSection,
  completed,
  total,
  onJump,
}: {
  activeSection: string;
  completed: number;
  total: number;
  onJump: (id: string) => void;
}) {
  const sectionMeta: Record<string, { objective: string; next: string | null }> = {
    intro: { objective: 'Build the core mental model: worlds and allowed moves.', next: 'part1' },
    part1: { objective: 'Understand why each number system exists.', next: 'part2' },
    part2: { objective: 'Feel operations as transformations.', next: 'part3' },
    part3: { objective: 'Master inverse thinking via exponents/logs.', next: 'part4' },
    part4: { objective: 'Predict long-run behavior by growth type.', next: 'part5' },
    part5: { objective: 'Use units as type safety.', next: 'part6' },
    part6: { objective: 'Decode representation versus value.', next: 'part7' },
    part7: { objective: 'Use prime/modular structure intentionally.', next: 'part8' },
    part8: { objective: 'Treat domain boundaries as diagnostic signals.', next: 'epilogue' },
    epilogue: { objective: 'Consolidate and transfer the model.', next: null },
  };

  const meta = sectionMeta[activeSection] ?? sectionMeta.intro;
  return (
    <div className="story-guide-bar">
      <div>
        <p className="story-guide-title">Current objective</p>
        <p className="story-guide-objective">{meta.objective}</p>
      </div>
      <div className="story-guide-actions">
        <span className="story-guide-progress">{completed}/{total} checkpoints</span>
        {meta.next && (
          <button onClick={() => onJump(meta.next!)} className="story-guide-btn">Next chapter</button>
        )}
      </div>
    </div>
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
          Continue where friction is lowest: {nextSectionId.toUpperCase()}
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
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <h4 className="text-green-400 font-semibold mb-2">What you will find:</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• The actual machinery</li>
              <li>• Why each part works that way</li>
              <li>• How to debug confusion</li>
            </ul>
          </div>
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

        <ConceptBridge
          visual="You are navigating worlds with different allowed moves."
          formal="A number system is useful when operations stay consistent inside it."
          transfer="When confusion hits, ask: did I hit a boundary or misuse an operation?"
        />

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
        to extend the system rather than accept the limitation.
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
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Level 2 — Integers: The Undo Button</h3>
        <p>
          <strong>ℤ = {'{'}…, −2, −1, 0, 1, 2, …{'}'}</strong> — We added "reverse gear."
        </p>

        <InteractiveWrapper
          title="Building Floors: Understanding Negatives"
          hint="Use the elevator buttons to see how negatives work as directions"
          interactionType="click"
        >
          <BuildingFloors />
        </InteractiveWrapper>

        <p>
          <strong>Key insight:</strong> Negatives aren't "less than nothing." They're <em>directions</em>.
        </p>
      </ScrollSection>

      <ScrollSection delay={0.2}>
        <h3>Level 3 — Rationals: Division (Almost) Always Works</h3>
        <p>
          <strong>ℚ = {'{'}p/q : p, q ∈ ℤ, q ≠ 0{'}'}</strong> — Now 7 ÷ 3 = 7/3 has an answer.
        </p>

        <InteractiveWrapper
          title="Rational Density: The √2 Gap"
          hint="Zoom in on √2 to see the 'hole' that rationals can't fill"
          interactionType="drag"
        >
          <RationalDensityZoom />
        </InteractiveWrapper>

        <p>
          <strong>The Wall:</strong> Despite being infinitely dense, rationals have <em>gaps</em>.
          √2 is not a fraction.
        </p>
      </ScrollSection>

      <ScrollSection delay={0.25}>
        <h3>Level 4 — Reals: No More Gaps</h3>
        <p>
          <strong>ℝ</strong> — Fills the holes. Now limits and measurement work reliably.
        </p>
        <p>
          <strong>The Wall:</strong> √(−1) doesn't exist. No real number squared is negative.
        </p>
      </ScrollSection>

      <ScrollSection delay={0.3}>
        <h3>Level 5 — Complex Numbers: A New Direction</h3>
        <p>
          <strong>ℂ = {'{'}a + bi{'}'} where i² = −1</strong>
        </p>

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

        <div className="nd-hook">
          <strong>Mind-bending insight:</strong> Multiplying by i = rotating 90°. Two rotations
          (i²) = 180° = pointing backwards = −1. That's why i² = −1!
        </div>
      </ScrollSection>
      <TransferChallenge
        title="Transfer challenge — Part 1"
        challenge={"A colleague says sqrt(-9) is impossible forever. How do you respond using world-extension logic?"}
        hint={"Name the current world first, then smallest extension."}
        answer={"In R it is undefined, but extending to C gives sqrt(-9)=3i while preserving prior real rules."}
      />

      <SectionCheckpoint
        title="Part 1 checkpoint"
        sectionId="part1"
        prompts={[
          'I can explain why ℕ, ℤ, ℚ, ℝ, ℂ were introduced in sequence.',
          'I can identify when an expression hits a system boundary.',
          'I can describe i as rotation, not magic.'
        ]}
      />
    </ScrollSection>
  );
}

function Part2Section() {
  return (
    <ScrollSection id="part2">
      <h2>PART TWO: Operations as "Moves"</h2>

      <ConceptBridge
        visual="Addition slides. Multiplication stretches. Division asks for the reverse stretch."
        formal="Operations are transformations with inverses and constraints."
        transfer="Use this lens in code, finance, and scaling systems: what changes linearly vs multiplicatively?"
      />

      <OperationMachine />

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Operation</th>
              <th>What It Does</th>
              <th>Inverse</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Addition</td>
              <td>Move/shift</td>
              <td>Subtraction</td>
            </tr>
            <tr>
              <td>Multiplication</td>
              <td>Scale/stretch</td>
              <td>Division</td>
            </tr>
            <tr>
              <td>Exponentiation</td>
              <td>Repeated scaling</td>
              <td>Logarithm</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ScrollSection delay={0.1}>
        <h3>Addition: Moving on the Number Line</h3>

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
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Multiplication: Scaling</h3>

        <InteractiveWrapper
          title="Multiplication as Scaling"
          hint="Drag the scale factor to stretch or shrink the number line"
          interactionType="drag"
        >
          <MultiplicationAsScaling />
        </InteractiveWrapper>

        <h4>Why Negative × Negative = Positive</h4>

        <InteractiveWrapper
          title="The Double Flip"
          hint="Click through to see why (−1) × (−1) must equal +1"
          interactionType="click"
        >
          <NegativeTimesNegative />
        </InteractiveWrapper>

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
      <TransferChallenge
        title="Transfer challenge — Part 2"
        challenge={"You doubled team size and work output tripled. Is this shift or scale behavior?"}
        hint="Ask whether change depends on multiplying current level."
        answer={"Scale behavior: multiplication-like change. Output depends on factor changes, not constant offsets."}
      />

      <SectionCheckpoint
        title="Part 2 checkpoint"
        sectionId="part2"
        prompts={[
          'I can distinguish shift vs scale operations visually.',
          'I can justify why division by zero fails uniqueness.',
          'I can explain distributivity in my own words.'
        ]}
      />
    </ScrollSection>
  );
}

function Part3Section() {
  return (
    <ScrollSection id="part3">
      <h2>PART THREE: Exponents and Logarithms</h2>

      <ConceptBridge
        visual="Exponents are repeated zooms; logs count how many zooms happened."
        formal="Exponentiation and logarithms are inverse operators on positive reals."
        transfer="Use this to decode growth, sound levels, pH, and compounding timelines."
      />

      <LogScaleBridge />

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

        <h4>Fractional Exponents = Roots</h4>
        <p>
          <strong>a^(1/2)</strong> means: "What number, when used as a scaling factor twice, gives a?"
        </p>

        <InteractiveWrapper
          title="Fractional Exponents: Finding Roots"
          hint="Watch the binary search find the exact root"
          interactionType="click"
        >
          <FractionalExponents />
        </InteractiveWrapper>
      </ScrollSection>

      <ScrollSection delay={0.15}>
        <h3>Logarithms: Counting the Scalings</h3>
        <p>
          If exponents are "do repeated scaling," logs ask <strong>"how many times?"</strong>
        </p>

        <InteractiveWrapper
          title="Logarithm Counter"
          hint="Enter a number to see how many times you divide to reach 1"
          interactionType="input"
        >
          <LogarithmCounter />
        </InteractiveWrapper>

        <h4>The Magic: Logs Turn Multiplication into Addition</h4>

        <InteractiveWrapper
          title="Log Property Visualizer"
          hint="Adjust the values to see how log(a×b) = log(a) + log(b)"
          interactionType="drag"
        >
          <LogMultiplicationAddition />
        </InteractiveWrapper>
      </ScrollSection>
      <TransferChallenge
        title="Transfer challenge — Part 3"
        challenge={"A metric rises from 5 to 40 by repeated x2 steps. How many steps happened?"}
        hint="Convert to a log question: 5·2^n=40."
        answer={"n=3 because 5*2^3=40. Log view counts multiplicative steps."}
      />

      <SectionCheckpoint
        title="Part 3 checkpoint"
        sectionId="part3"
        prompts={[
          'I can move between exponent and log viewpoints.',
          'I can test whether a log input is valid.',
          'I can explain fractional exponents as root-questions.'
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

      <Suspense fallback={<WebGLFallback label="Loading growth scene..." />}><GrowthCurvesWebGL /></Suspense>

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
      <TransferChallenge
        title="Transfer challenge — Part 4"
        challenge="A bug count grows 4, 8, 16, 32... Which response strategy is safest?"
        hint="Classify growth type before proposing action."
        answer="Exponential growth demands urgent intervention now; waiting causes runaway escalation."
      />

      <SectionCheckpoint
        title="Part 4 checkpoint"
        sectionId="part4"
        prompts={[
          'I can classify a growth pattern by its long-run behavior.',
          'I can articulate why exponential growth becomes dominant.',
          'I can connect growth type to practical risk.'
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

      <UnitCancellationFlow />

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
      <TransferChallenge
        title="Transfer challenge — Part 5"
        challenge={"Can you add 60 km/h and 2 hours directly?"}
        hint="Check unit compatibility before arithmetic."
        answer="No. Different dimensions. Multiply to get distance (km), then combine with compatible units."
      />

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

      <BasePlaceValueStory />

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
      <TransferChallenge
        title="Transfer challenge — Part 6"
        challenge={"If 1010 base2 equals 10 base10, what idea stays invariant across bases?"}
        hint="Representation changes; quantity does not."
        answer="The value is invariant; only the encoding symbols and place weights differ by base."
      />

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

        <Suspense fallback={<WebGLFallback label="Loading modular wrap scene..." />}><ModularWrapWebGL /></Suspense>

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
      <TransferChallenge
        title="Transfer challenge — Part 7"
        challenge={"What is 38 mod 12 and why does this matter for schedules?"}
        hint="Use quotient/remainder and clock wrap."
        answer="38 mod 12 = 2. Cyclic systems ignore full wraps and keep the remainder state."
      />

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

      <DomainHeatmap />

      <InteractiveWrapper
        title="Domain Boundary Explorer"
        hint="Explore different operations to see where they break down"
        interactionType="explore"
      >
        <DomainBoundaryExplorer />
      </InteractiveWrapper>
      <TransferChallenge
        title="Transfer challenge — Part 8"
        challenge={"A model outputs log(-3). Do you patch the number or patch the model world?"}
        hint="Boundary errors are diagnostics, not annoyances."
        answer="Patch the model: either constrain domain or extend framework. For real logs, negative input is invalid."
      />

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
