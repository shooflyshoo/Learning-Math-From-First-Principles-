import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from './components';
import './index.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'thesis', title: 'Thesis: Math as Video Game' },
  { id: 'part1', title: 'Part 1: Number Systems' },
  { id: 'part2', title: 'Part 2: Operations' },
  { id: 'part3', title: 'Part 3: Exponents & Logs' },
  { id: 'part4', title: 'Part 4: Growth Types' },
  { id: 'part5', title: 'Part 5: Units' },
  { id: 'part6', title: 'Part 6: Number Bases' },
  { id: 'part7', title: 'Part 7: Number Theory' },
  { id: 'part8', title: 'Part 8: Boundaries' },
  { id: 'epilogue', title: 'Epilogue & Debug Kit' },
];

function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.nav
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-full w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-40 overflow-y-auto"
            >
              <NavContent activeSection={activeSection} scrollToSection={scrollToSection} />
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-40 overflow-y-auto">
        <NavContent activeSection={activeSection} scrollToSection={scrollToSection} />
      </nav>

      <main className="lg:ml-64 p-4 md:p-8 lg:p-12">
        <article className="max-w-4xl mx-auto essay-content">
          <IntroSection />
          <ThesisSection />
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

        <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-700 text-center text-slate-500">
          <p>Mathematics From First Principles — An Interactive Learning Experience</p>
          <p className="text-sm mt-2">Designed for visual/kinesthetic learners and neurodivergent minds</p>
        </footer>
      </main>
    </div>
  );
}

function NavContent({ activeSection, scrollToSection }: { activeSection: string; scrollToSection: (id: string) => void }) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        Math From First Principles
      </h2>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`nav-link w-full text-left ${activeSection === section.id ? 'active' : ''}`}
          >
            {section.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function IntroSection() {
  return (
    <section id="intro" className="mb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1>MATHEMATICS FROM FIRST PRINCIPLES</h1>
        <p className="text-xl text-slate-400 mb-8">The Bulletproof Rebuild (Layman + Neurodivergent Lens)</p>
        <hr />
        <h2>One Promise Up Front</h2>
        <p>This isn't "here are rules, please obey." This is "here's the machine, here's why the machine has to behave this way, and here's how to debug it when it breaks."</p>
        <p>If your brain likes systems, contracts, and edge-cases (ENTP brain, ADHD brain, autism brain, "I need it to make sense or I revolt" brain), this is built for you.</p>
        <p><strong>What you won't find here:</strong></p>
        <ul>
          <li>"Just memorize this"</li>
          <li>"Because I said so"</li>
          <li>"Don't worry about why"</li>
        </ul>
        <p><strong>What you will find:</strong></p>
        <ul>
          <li>The actual machinery</li>
          <li>Why each part has to work that way</li>
          <li>What breaks when you violate the rules</li>
          <li>How to debug your own confusion</li>
        </ul>
      </motion.div>
    </section>
  );
}

function ThesisSection() {
  return (
    <section id="thesis">
      <hr />
      <h2>THESIS: Math Is a Tower of "Allowed Moves"</h2>
      <p>Think of math like a video game world with physics rules.</p>
      <ul>
        <li>Each "number system" is a world with a certain set of allowed moves (add, subtract, multiply, divide…).</li>
        <li>You hit a wall when a move has no valid result inside that world.</li>
        <li>To keep the old rules consistent and still do the move, you "unlock a new zone" by adding new kinds of numbers.</li>
      </ul>
      <p>That is the engine of mathematical progress:</p>
      <ul>
        <li><strong>Keep the contracts</strong></li>
        <li><strong>Extend the world</strong></li>
        <li><strong>Gain new powers</strong></li>
      </ul>
      <p>"Contracts" here just means: rules you refuse to break because they make the whole system coherent (predictable and reversible in the ways you care about).</p>
      <h3>Why This Framing Matters for Your Brain</h3>
      <p>Most people learn math as "here's a rule, now apply it." That works fine until you hit something confusing, and then you have no debugging tools. You're just stuck.</p>
      <p>The "video game world" framing gives you something better: <strong>a mental model of the system itself</strong>. When something breaks, you can ask:</p>
      <ul>
        <li>What world am I in?</li>
        <li>What move am I trying to make?</li>
        <li>Is this move even allowed here?</li>
        <li>Do I need to upgrade to a bigger world?</li>
      </ul>
      <p>That's not memorization. That's understanding.</p>
    </section>
  );
}

function Part1Section() {
  return (
    <section id="part1">
      <hr />
      <h2>PART ONE: The Number Systems Ladder (Why Each One Exists)</h2>
      <p>Each level of this ladder exists because <strong>someone hit a wall</strong> and decided to extend the system rather than accept the limitation.</p>
      <p>This isn't abstract history. This is the exact sequence your brain can follow to understand why math is structured the way it is.</p>
      <NumberSystemsLadder />
      <hr />
      <h3>Level 1 — Natural Numbers: Counting World</h3>
      <p><strong>ℕ = {'{'}0, 1, 2, 3, …{'}'}</strong></p>
      <p><strong>What it's for:</strong> "How many?"</p>
      <p>Apples, clicks, steps, inventory. Anything you can count by pointing and saying "one, two, three…"</p>
      <p><strong>What works smoothly:</strong></p>
      <ul>
        <li><strong>Addition:</strong> counting forward</li>
        <li><strong>Multiplication:</strong> repeated counting or scaling counts</li>
      </ul>
      <p><strong>The Vibe:</strong> Natural numbers are the "only forward" world. You can pile things up. You can count groups of groups. Everything is positive, concrete, and accumulating.</p>
      <p><strong>Where you slam into the wall:</strong> Subtraction isn't always possible.</p>
      <p><strong>Example:</strong> 3 − 5</p>
      <p>In counting-world, this is asking: "I have 3 apples. Remove 5. How many left?" The question doesn't compute. You can't have negative apples in a world that only knows counting.</p>
      <p><strong>What This Wall Feels Like:</strong> You're playing a game where your health can only go from 0 to 100. Someone asks "what's your health at -20?" The game doesn't have that concept. It's not that -20 is wrong—it's that -20 doesn't exist in this world.</p>
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Natural numbers are the "only forward" world. Great for tallying. Terrible for undo buttons. If your brain wants "what if I need to go backwards?", you've just discovered why integers were invented.
      </div>
      <hr />
      <h3>Level 2 — Integers: Undo Button for Addition</h3>
      <p><strong>ℤ = {'{'}…, −2, −1, 0, 1, 2, …{'}'}</strong></p>
      <p><strong>Why integers were invented:</strong> To make subtraction always solvable.</p>
      <p>In counting-world, subtraction sometimes fails. So we add "opposites": For every a, invent −a such that: <strong>a + (−a) = 0</strong></p>
      <p>Now subtraction becomes: <strong>a − b = a + (−b)</strong></p>
      <p>So: <strong>3 − 5 = 3 + (−5) = −2</strong></p>
      <p><strong>The Upgrade in Plain Terms:</strong> We've added a "reverse gear." Every forward move now has a corresponding backward move that exactly cancels it.</p>
      <p><strong>Key Intuition:</strong> Negatives aren't "less than nothing." They're <strong>directions</strong> (or offsets).</p>
      <BuildingFloors />
      <p><strong>The Debt Analogy:</strong></p>
      <ul>
        <li>$100 in your account = +100</li>
        <li>$50 owed = −50</li>
        <li>Net position = 100 + (−50) = 50</li>
      </ul>
      <p>Negative numbers aren't imaginary. They're tracking a real relationship—you just need a reference point (zero) to make sense of the sign.</p>
      <p><strong>Where you hit the next wall:</strong> Division isn't always possible.</p>
      <p><strong>Example:</strong> 7 ÷ 3 — No integer solves "3 times what equals 7?"</p>
      <hr />
      <h3>Level 3 — Rationals: Undo Button for Multiplication (Usually)</h3>
      <p><strong>ℚ = {'{'}p/q : p, q ∈ ℤ, q ≠ 0{'}'}</strong></p>
      <p><strong>Why rationals were invented:</strong> To make division solvable whenever you're not dividing by zero.</p>
      <p>We add <strong>reciprocals</strong>: For any nonzero a, add 1/a so that: <strong>a · (1/a) = 1</strong></p>
      <p>Now: <strong>7 ÷ 3 = 7/3</strong></p>
      <p><strong>Why Fractions Feel "New" But Aren't:</strong> Fractions are just <strong>exact scale factors</strong> and <strong>exact ratios</strong>. When you write 3/4, you're saying: "the number that, when multiplied by 4, gives 3."</p>
      <p><strong>Between Any Two Fractions, There's Always Another:</strong> The rationals are "dense"—infinitely packed together, no matter how close you zoom.</p>
      <p><strong>Next Wall: "Holes"</strong> — Despite being infinitely dense, the rationals have <strong>gaps</strong>. <strong>√2 is not a fraction.</strong></p>
      <RationalDensityZoom />
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Rationals are "everything you can do with exact ratios," but reality has measurements that aren't expressible as exact ratios. The diagonal of a square with side 1 is √2. That length exists geometrically but not as a fraction.
      </div>
      <hr />
      <h3>Level 4 — Reals: The Continuous Number Line (No Gaps)</h3>
      <p><strong>ℝ</strong></p>
      <p><strong>Why reals were invented:</strong> To fill in the "holes" so limits and measurement behave reliably.</p>
      <p><strong>Plain-Language Version of "Completeness":</strong> In the real numbers, if you keep zooming in on a target value by a consistent process, <strong>you don't fall into a missing pixel</strong>. The target point exists in the system.</p>
      <p><strong>What This Unlocks:</strong></p>
      <ul>
        <li><strong>√2 exists as a real number.</strong> The hole is filled.</li>
        <li><strong>Calculus becomes possible.</strong> If there are holes, limits don't work reliably. With completeness, they do.</li>
      </ul>
      <p><strong>Next Wall:</strong> <strong>√(−1) doesn't exist as a real number.</strong> No real number squared is negative.</p>
      <hr />
      <h3>Level 5 — Complex Numbers: Add a New Direction</h3>
      <p><strong>ℂ = {'{'}a + bi{'}'} where i² = −1</strong></p>
      <p><strong>Why complex numbers exist:</strong> Not because mathematicians got bored. Because some equations and oscillations demand it.</p>
      <p><strong>The Key Move:</strong> We define i as a number with the property that i² = −1. This isn't "imaginary" in the sense of "fake." It's imaginary in the sense of "we imagined it into existence to solve a problem."</p>
      <ComplexPlane />
      <p><strong>The Rotation Interpretation:</strong> Multiplying by i is the same as <strong>rotating 90° counterclockwise</strong> on the complex plane.</p>
      <ul>
        <li>Start at 1 (pointing right)</li>
        <li>Multiply by i: now at i (pointing up)</li>
        <li>Multiply by i again: now at −1 (pointing left)</li>
        <li>Multiply by i again: now at −i (pointing down)</li>
        <li>Multiply by i again: back at 1 (pointing right)</li>
      </ul>
      <p>And i² = −1 makes sense: two 90° rotations = 180° = you're pointing the opposite direction.</p>
      <p><strong>Real-World Vibe:</strong> Complex numbers are the natural language of electrical engineering (AC signals), waves, rotations, control systems, and quantum mechanics.</p>
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Complex numbers are what happens when you take "what if there was a perpendicular direction?" seriously. They're the natural coordinate system for anything that rotates or oscillates.
      </div>
      <hr />
      <h3>Why This Ladder Matters</h3>
      <p>Each step is: <strong>keep the old operation contracts consistent, add the minimal new objects so previously-unsolvable equations become solvable.</strong></p>
      <table>
        <thead><tr><th>Level</th><th>What's Added</th><th>What It Solves</th></tr></thead>
        <tbody>
          <tr><td>ℕ → ℤ</td><td>Negative numbers</td><td>Subtraction always works</td></tr>
          <tr><td>ℤ → ℚ</td><td>Fractions</td><td>Division (except by 0) always works</td></tr>
          <tr><td>ℚ → ℝ</td><td>Limits/completeness</td><td>No more holes; calculus works</td></tr>
          <tr><td>ℝ → ℂ</td><td>Imaginary unit i</td><td>All polynomial roots exist</td></tr>
        </tbody>
      </table>
      <p><strong>That's mathematics' growth pattern in one sentence:</strong> Preserve the contracts. Extend the world. Gain new powers.</p>
    </section>
  );
}

function Part2Section() {
  return (
    <section id="part2">
      <hr />
      <h2>PART TWO: Operations as Simple "Moves" + The Contracts They Obey</h2>
      <h3>A Quick Map (The Simplest Mental Model)</h3>
      <table>
        <thead><tr><th>Operation</th><th>What It Does</th><th>The Inverse</th><th>What the Inverse Asks</th></tr></thead>
        <tbody>
          <tr><td>Addition</td><td>Move/shift</td><td>Subtraction</td><td>"What move undoes this?"</td></tr>
          <tr><td>Multiplication</td><td>Scale/stretch/shrink</td><td>Division</td><td>"What scale factor undoes this?"</td></tr>
          <tr><td>Exponentiation</td><td>Repeat scaling</td><td>Logarithm</td><td>"How many repeats happened?"</td></tr>
        </tbody>
      </table>
      <p>If you can hold that map, most rules stop being memorization and start being <strong>inevitabilities</strong>.</p>
      <hr />
      <h3>1) Addition: Grouping / Moving</h3>
      <p><strong>Addition is a move on the number line.</strong> 5 + 3 means "start at 5, move right 3."</p>
      <AdditionAsMovement />
      <h4>Why This Interpretation Is Powerful</h4>
      <ul>
        <li><strong>Zero is special because it means "move by nothing."</strong> a + 0 = a</li>
        <li><strong>Negatives mean "move left."</strong> 5 + (−3) means "move left 3."</li>
        <li><strong>Addition is commutative (order doesn't matter).</strong> 5 + 3 = 3 + 5</li>
        <li><strong>Addition is associative (grouping doesn't matter).</strong> (2 + 3) + 4 = 2 + (3 + 4)</li>
      </ul>
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Subtraction = addition with a "reverse move." It's not a separate operation; it's the undo button for addition.
      </div>
      <hr />
      <h3>2) Multiplication: Scaling / Resizing</h3>
      <p><strong>Multiplication is scaling the number line.</strong> Every point gets stretched away from (or compressed toward) zero by the same factor.</p>
      <MultiplicationAsScaling />
      <h4>Why "Repeated Addition" Is Only a Training Wheel</h4>
      <p>3 × 4 = 3 + 3 + 3 + 3 works for whole numbers. But what's 3 × 0.5? Or 3 × (−2)? "Repeated addition" breaks down. Scaling doesn't.</p>
      <h4>Why Negative × Negative = Positive (The Forced Reason)</h4>
      <NegativeTimesNegative />
      <hr />
      <h3>3) Distributivity: The "Compatibility Law" Between Add and Multiply</h3>
      <p>This is the big interoperability contract: <strong>a(b + c) = ab + ac</strong></p>
      <p><strong>Plain English:</strong> Scaling a combined thing equals scaling each part then recombining.</p>
      <DistributivityRectangle />
      <p><strong>Why This Is Enormous:</strong> Distributivity is what makes algebra possible—expanding, factoring, simplifying, solving equations.</p>
      <hr />
      <h3>4) Division: "Solve a Multiplication" (One Machine, Three Stories)</h3>
      <p>Division is not a new operation. It's a question: <strong>a ÷ b = x</strong> means <strong>b · x = a</strong></p>
      <ThreeFacesOfDivision />
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Division creates a "per." 12 cookies ÷ 3 kids = 4 cookies <em>per</em> kid. Division manufactures ratios.
      </div>
      <h4>Why Division by Zero Is Undefined</h4>
      <DivisionByZero />
    </section>
  );
}

function Part3Section() {
  return (
    <section id="part3">
      <hr />
      <h2>PART THREE: Iteration — Exponents and Logs (In Human Terms)</h2>
      <h3>Exponents: Repeated Scaling</h3>
      <p><strong>2³ means:</strong> Start at 1, scale by 2, three times. 1 → 2 → 4 → 8</p>
      <p><strong>That's it.</strong> Exponents count how many times you apply the same scaling factor.</p>
      <ExponentsAsSteps />
      <h4>The Three Exponent Laws (Why They're Inevitable)</h4>
      <ul>
        <li><strong>Law 1: aᵐ · aⁿ = aᵐ⁺ⁿ</strong> — m scalings + n scalings = (m+n) total</li>
        <li><strong>Law 2: (aᵐ)ⁿ = aᵐⁿ</strong> — "m scalings" repeated n times = mn scalings</li>
        <li><strong>Law 3: aᵐ / aⁿ = aᵐ⁻ⁿ</strong> — Undo n scalings from m → (m−n) remain</li>
      </ul>
      <h4>Fractional Exponents = Roots</h4>
      <p><strong>a^(1/2) means:</strong> "What number, when used as a scaling factor twice, gives a?" That's √a.</p>
      <FractionalExponents />
      <hr />
      <h3>Logarithms: Counting How Many Scalings Happened</h3>
      <p>If exponents are "do repeated scaling," logs are <strong>"how many repeats?"</strong></p>
      <p><strong>2³ = 8</strong> means <strong>log₂(8) = 3</strong></p>
      <LogarithmCounter />
      <h4>The Magic Feature: Logs Turn Multiplication into Addition</h4>
      <p><strong>log(a · b) = log(a) + log(b)</strong></p>
      <LogMultiplicationAddition />
      <p><strong>Why Log Scales Appear Everywhere:</strong> Log scales are natural when <strong>ratios matter more than absolute differences</strong>—sound (decibels), earthquakes (Richter), acidity (pH).</p>
    </section>
  );
}

function Part4Section() {
  return (
    <section id="part4">
      <hr />
      <h2>PART FOUR: Growth Types (How Systems Behave Over Time)</h2>
      <p>This section tells you whether something will <strong>stay stable, creep up, or explode</strong>.</p>
      <GrowthTypesRace />
      <h3>Linear Growth: "Add the Same Amount"</h3>
      <p><strong>Example:</strong> +10 each step: 10, 20, 30, 40… <strong>Signature:</strong> First differences are constant. <strong>Vibe:</strong> Predictable, budgetable.</p>
      <h3>Polynomial Growth: "Add Increases That Themselves Grow"</h3>
      <p><strong>Example:</strong> Squares: 1, 4, 9, 16, 25… <strong>Signature:</strong> Second differences are constant.</p>
      <h3>Exponential Growth: "Multiply by the Same Factor"</h3>
      <p><strong>Example:</strong> ×2 each step: 2, 4, 8, 16, 32… <strong>Signature:</strong> Ratio is constant. <strong>Vibe:</strong> Looks cute at first, then eats your civilization.</p>
      <table>
        <thead><tr><th>Type</th><th>Formula</th><th>Discriminator</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td>Linear</td><td>an + b</td><td>1st diff constant</td><td>Steady, sustainable</td></tr>
          <tr><td>Polynomial</td><td>nᵏ</td><td>k-th diff constant</td><td>Accelerates then stabilizes</td></tr>
          <tr><td>Exponential</td><td>cⁿ</td><td>Ratio constant</td><td>Explodes</td></tr>
          <tr><td>Factorial</td><td>n!</td><td>Ratio grows</td><td>Explodes faster</td></tr>
        </tbody>
      </table>
      <p><strong>Why This Matters:</strong> Linear = manageable. Polynomial = manageable with effort. Exponential = you're on a timer.</p>
    </section>
  );
}

function Part5Section() {
  return (
    <section id="part5">
      <hr />
      <h2>PART FIVE: Units Are "Type Labels" That Behave Like Exponents</h2>
      <p>If your brain likes <strong>type systems</strong> in programming, units are exactly that.</p>
      <h3>The Key Rule</h3>
      <ul>
        <li><strong>Multiply → unit-exponents add</strong></li>
        <li><strong>Divide → unit-exponents subtract</strong></li>
      </ul>
      <UnitCalculator />
      <h3>Why You Can't Add Apples and Seconds</h3>
      <p><strong>Addition requires same type:</strong> 3 meters + 5 meters = 8 meters ✓ | 3 meters + 5 seconds = ??? ✗</p>
      <p><strong>Dimensional Analysis = Built-In Error Checking:</strong> If units don't match on both sides, the equation is wrong before you compute.</p>
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Units are like the type checker in a programming language. If your code tries to add a string and an integer, the compiler complains. If your physics tries to add meters and seconds, dimensional analysis complains.
      </div>
    </section>
  );
}

function Part6Section() {
  return (
    <section id="part6">
      <hr />
      <h2>PART SIX: Number Bases (Different Encodings, Same Reality)</h2>
      <h3>Place Value Is an Encoding Trick</h3>
      <p><strong>3456 in base 10 means:</strong> 3 × 10³ + 4 × 10² + 5 × 10¹ + 6 × 10⁰ = 3456</p>
      <PlaceValueExploder />
      <h3>Base 10 Isn't Special</h3>
      <p>Why base 10? <strong>You have 10 fingers.</strong> That's it. Mathematically, any base works.</p>
      <p><strong>The Key Insight:</strong> Different base = different representation, same quantity. The number "eleven" is 11₁₀ = 1011₂ = B₁₆.</p>
    </section>
  );
}

function Part7Section() {
  return (
    <section id="part7">
      <hr />
      <h2>PART SEVEN: Number Theory Highlights</h2>
      <h3>Primes: The Atoms of Multiplication</h3>
      <p><strong>Definition:</strong> A prime number is only divisible by 1 and itself. 2, 3, 5, 7, 11, 13, 17, 19, 23…</p>
      <p><strong>The Fundamental Theorem of Arithmetic:</strong> Every integer {'>'} 1 factors <strong>uniquely</strong> into primes.</p>
      <PrimeFactorTree />
      <p><strong>Cryptography depends on this:</strong> Multiplying two large primes is easy. Factoring the product is hard. This asymmetry is the foundation of RSA encryption.</p>
      <hr />
      <h3>Modular Arithmetic: "Clock Math"</h3>
      <p><strong>Working "mod 12" means numbers wrap:</strong> 14 ≡ 2 (mod 12)</p>
      <ModularClock />
      <p><strong>Why This Is Useful:</strong> Error checking (ISBN, credit cards), cryptography, scheduling cycles.</p>
      <div className="nd-hook">
        <strong>Neurodivergent Hook:</strong> Modular arithmetic is the math of <strong>cycles and periodicity</strong>. Anything that repeats—clocks, calendars, rotations—can be modeled with mod.
      </div>
    </section>
  );
}

function Part8Section() {
  return (
    <section id="part8">
      <hr />
      <h2>PART EIGHT: Domain Boundaries (The Map of Where Rules Stop Working)</h2>
      <p><strong>Boundaries are not embarrassing. They're the truth serum.</strong></p>
      <p>Every system has places where operations don't work. Mapping these boundaries tells you what world you're in.</p>
      <DomainBoundaryExplorer />
      <p><strong>A Boundary Tells You:</strong> Either accept the limitation, or extend the system. Both are valid responses. The key is knowing which boundary you've hit.</p>
    </section>
  );
}

function EpilogueSection() {
  return (
    <section id="epilogue">
      <hr />
      <h2>EPILOGUE: The "Load-Bearing Walls" in Plain English</h2>
      <p>If you remember only a few core ideas, remember these:</p>
      <ol>
        <li><strong>Math grows by extending worlds without breaking the old contracts.</strong></li>
        <li><strong>Addition is moving; multiplication is scaling.</strong></li>
        <li><strong>Subtraction/division/logs are "solve the inverse problem."</strong></li>
        <li><strong>Distributivity is the interoperability rule that makes algebra possible.</strong></li>
        <li><strong>Boundaries are part of the design; they show you what kind of world you're in.</strong></li>
        <li><strong>Units are a type system that prevents nonsense.</strong></li>
        <li><strong>Growth types predict whether something is stable or explodes.</strong></li>
      </ol>
      <p><strong>That's the architecture.</strong></p>
      <hr />
      <h2>A Neurodivergent-Friendly "Debug Kit" (Practical)</h2>
      <p>When math feels slippery, run these checks:</p>
      <DebugKit />
      <p>If you use those five questions internally, you stop "doing math" and start <strong>running the machine correctly</strong>.</p>
      <hr />
      <h2>What Comes Next</h2>
      <p>If you keep building from here, the next natural layers are:</p>
      <ul>
        <li><strong>Functions as "machines":</strong> Input → transformation → output</li>
        <li><strong>Composition as "chaining machines":</strong> f then g = g(f(x))</li>
        <li><strong>Matrices as "scaling + rotating machines where order matters":</strong> Linear algebra</li>
        <li><strong>Calculus as "what happens at infinitely small scales":</strong> Limits, derivatives, integrals</li>
        <li><strong>Abstract algebra as "what if we generalize these structures?":</strong> Groups, rings, fields</li>
      </ul>
      <p>The same pattern continues: <strong>identify invariants, hit boundaries, extend while preserving contracts.</strong></p>
      <hr />
      <p className="text-center text-slate-500 text-lg py-8"><strong>End of Text Lecture</strong></p>
    </section>
  );
}

export default App;
