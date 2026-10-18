export const chapters = [
  {
    id:'fundamentals', chapter:'01', title:'What fine tuning actually is', duration:'12 min', level:'FOUNDATIONS', icon:'brain', kicker:'The idea',
    intro:'A language model has already learned broad patterns from enormous amounts of text. Fine tuning starts with that existing model and gives it additional practice for a narrower behaviour.',
    analogy:'Imagine an experienced software engineer joining a new team. You do not teach them programming again. You teach them your team’s conventions, terminology and examples.',
    learn:['Explain pretraining versus fine tuning','Understand what a training example looks like','Know when fine tuning is the wrong tool'],
    blocks:[
      {title:'Pretraining vs fine tuning',body:'Pretraining is the enormous, general learning stage performed by the model creator. Fine tuning is an additional, smaller learning stage that changes selected model weights using examples of the behaviour you want. It does not guarantee factual accuracy, and it does not automatically add a searchable database of new facts.'},
      {title:'When to use fine tuning',body:'Use it to consistently follow a particular output schema, tone, terminology or task pattern. If the main problem is answering questions about documents that change daily, retrieval with current sources is usually a better starting point.'},
      {title:'Our experiment',body:'We will teach a 0.6 billion parameter Qwen3 model to answer short programming questions in a prescribed two-line format: Meaning and Example. This is a teaching exercise, not evidence that the resulting model is broadly more intelligent.'},
    ],
    activity:'Compare the exact same question before and after training. Record whether the response follows the desired structure AND whether the explanation is correct.',
    quiz:{q:'What does fine tuning change?',options:['The display resolution of the GPU','Some trainable parameters that influence the model’s outputs','Only the text in your prompt'],correct:1,why:'Fine tuning updates learned numerical parameters. In this course, we update lightweight LoRA adapter parameters rather than all of the base model weights.'}
  },
  {
    id:'stack', chapter:'02', title:'Colab, Qwen, Unsloth & Ollama',duration:'10 min',level:'TOOLS',icon:'layers',kicker:'The toolkit',
    intro:'These tools play different roles. Knowing which tool does which job prevents most beginner confusion.',
    analogy:'Colab is the rented workshop, Qwen is the machine you are customising, Unsloth is the efficient toolkit, and Ollama is where you may operate the finished machine locally.',
    learn:['Identify the role of each tool','Know which computer performs the training','Understand why Colab does not require a high-end laptop GPU'],
    blocks:[
      {title:'Google Colab = cloud computer + notebook',body:'You write and execute Python code inside a browser. When you select a GPU runtime, those calculations run on Google-hosted hardware, not on your Windows RTX 3050. Free GPU availability is variable and sessions can disconnect.'},
      {title:'Qwen = the existing open-weight model',body:'Qwen3 0.6B is the starting pretrained language model. Its 0.6B label means roughly 600 million parameters. A much smaller model makes first experiments faster and cheaper than starting with 27B.'},
      {title:'Unsloth = efficient model loading and training',body:'Unsloth integrates with libraries such as PyTorch, Transformers and TRL. It helps load compatible models with reduced memory and attach trainable LoRA weights; it does not provide a cloud GPU by itself.'},
      {title:'Ollama = an optional local inference runner',body:'After training you may export a suitable GGUF and use Ollama on Windows to ask the tuned model questions. Ollama is not used to perform the Colab training itself.'},
    ],
    activity:'Draw four boxes: Colab → Qwen + Unsloth → trained adapter → optional Ollama. Explain the role of each box aloud.',
    quiz:{q:'Where does the training run when you select a GPU in Google Colab?',options:['On your laptop RTX 3050','On a Google-hosted runtime','On the Ollama website'],correct:1,why:'The GPU attached to a Colab runtime lives in the cloud. Your browser is just the control panel.'}
  },
  {
    id:'lora',chapter:'03',title:'LoRA, QLoRA & quantisation',duration:'16 min',level:'CORE CONCEPT',icon:'cpu',kicker:'Making training fit',
    intro:'A large neural network contains many numerical values called weights. Updating all of them is expensive. LoRA and quantisation help fit learning into smaller GPUs.',
    analogy:'Instead of rewriting a whole textbook, LoRA adds a small notebook of specialised corrections. Quantisation is like storing the huge original textbook with more compact numbers.',
    learn:['Distinguish full fine tuning from LoRA','Explain what QLoRA adds','Understand 4-bit weights versus 16-bit compute'],
    blocks:[
      {title:'What does LoRA do?',body:'LoRA freezes the original weights and introduces relatively small trainable matrices into selected layers. During training, the gradient updates these small matrices rather than the entire base model. You save the adapter separately.'},
      {title:'What does QLoRA add?',body:'QLoRA combines LoRA adapters with a quantised base model, often stored in 4-bit form, to save GPU memory. Operations still use appropriate compute precisions; “4 bit model” does not mean every training calculation happens in 4 bits.'},
      {title:'Rank (r), alpha and target modules',body:'Rank r controls the size of the LoRA update matrices. Alpha affects their scaling. Target modules select which parts of the model receive adapters. In the starter notebook we use r=8, alpha=16, and attention plus feedforward projection modules. They are reasonable demonstration settings, not universally optimal.'},
      {title:'Why memory matters beyond model weights',body:'During training, memory also holds activations, adapter gradients, optimisation state and temporary buffers. Context length and batch size matter. A 0.6B model at 4-bit can still need substantially more than the raw weight-size formula predicts.'},
    ],
    activity:'Open the Memory Explorer. Compare 4-bit, 8-bit and 16-bit raw model weights, then switch to the LoRA visualisation.',
    quiz:{q:'In our QLoRA-style experiment, which values receive weight updates?',options:['The original base model weights only','The newly added LoRA adapter weights','Every tensor including the tokenizer'],correct:1,why:'The quantised base model is held fixed while lightweight adapter matrices are trained.'}
  },
  {
    id:'colab',chapter:'04',title:'Open and prepare Google Colab',duration:'12 min',level:'SETUP',icon:'cloud',kicker:'Get a GPU',
    intro:'A Colab notebook is a page of code cells. You execute cells in order, and the code runs on a temporary cloud machine.',
    analogy:'Think of each cell as one instruction in a laboratory protocol. If you restart the machine, its temporary files and installed packages may disappear.',
    learn:['Open a notebook and request a GPU','Read the output of nvidia-smi','Install the software used in this lab'],
    blocks:[
      {title:'Click sequence',body:'Go to colab.research.google.com, create or upload a notebook, choose Runtime → Change runtime type → a GPU accelerator if available, and save. Free-tier availability depends on demand and Google’s policies.'},
      {title:'Check the GPU before anything else',body:'Run !nvidia-smi to read GPU type, driver and memory. Then import torch and check torch.cuda.is_available(). The message True tells you PyTorch can communicate with a compatible NVIDIA GPU.'},
      {title:'Install packages inside Colab',body:'Run %pip -q install -U unsloth datasets trl. The percent sign means a notebook command, not regular Python. The command installs libraries onto the temporary cloud runtime, not your Windows machine.'},
      {title:'Important caveat',body:'Package APIs and model checkpoints evolve. If a library update changes an argument or a compatible CUDA build, consult the linked official documentation and update the cell rather than treating errors as your hardware failing.'},
    ],
    activity:'Run notebook steps 01 and 02. Write down the GPU name, reported VRAM and whether CUDA is available.',
    quiz:{q:'What happens to files stored only on a temporary Colab runtime after the session ends?',options:['They are always kept forever','They may disappear','They automatically become Ollama models'],correct:1,why:'Colab runtimes are temporary. Download the adapter or copy it to persistent storage after training.'}
  },
  {
    id:'dataset',chapter:'05',title:'Build a small honest dataset',duration:'18 min',level:'PRACTICAL',icon:'database',kicker:'Teach by example',
    intro:'Fine tuning learns from examples of desired input and output. The examples must be well formed and must match the task you actually want to teach.',
    analogy:'Training examples are practice questions with answer keys. Test examples are the exam. Never let the student see the exam answers during practice.',
    learn:['Create instruction and answer pairs','Separate training examples from evaluation examples','Format a chat dataset with the tokenizer'],
    blocks:[
      {title:'48 training examples, 12 unseen questions',body:'The bundled notebook synthesises 48 short examples across 12 basic programming topics and holds back 12 questions covering three other topics. The numbers are intentionally small so you can learn the pipeline, not to produce a production-quality model.'},
      {title:'Avoid leaking the exam',body:'If a test question or its close paraphrase appears in the training data, a high score can simply indicate memorisation. Inspect the held-out questions and keep them separate from the trainer.'},
      {title:'System, user and assistant roles',body:'A chat model expects structured messages. The chat template adds the appropriate special tokens that identify the system instruction, the user prompt and the correct assistant response. Avoid guessing or manually inventing these tokens.'},
      {title:'What makes good training examples?',body:'Check factual correctness, diversity of phrasing, consistent output structure and the absence of secrets or personal data. A few inaccurate answers can teach the model undesirable patterns.'},
    ],
    activity:'In Dataset Studio, create two examples of your own, inspect the JSONL export, and decide which unseen questions should remain outside training.',
    quiz:{q:'Why keep an unseen test set?',options:['To make the file larger','To test whether the model works on examples it did not train on','To provide the model with hints during training'],correct:1,why:'You want generalisation, not memorisation of the practice answers.'}
  },
  {
    id:'training',chapter:'06',title:'Train the LoRA adapter',duration:'25 min',level:'HANDS ON',icon:'activity',kicker:'The training loop',
    intro:'Training repeatedly compares the model’s predicted token probabilities against known answers, calculates a loss and updates the small adapter weights.',
    analogy:'A student takes a practice question, compares the answer against the key, learns from the error, and tries another question. Many repetitions gradually adjust behaviour.',
    learn:['Read every critical trainer setting','Start a short training run','Interpret training loss without overclaiming'],
    blocks:[
      {title:'Sequence length',body:'max_length=512 limits the number of tokens per example. Larger values allow longer training text but usually consume more GPU memory. Our short answers do not require long sequences.'},
      {title:'Batch size and gradient accumulation',body:'per_device_train_batch_size=1 processes one example at a time. gradient_accumulation_steps=4 combines four small gradient calculations before an optimiser update. This approximates a larger effective batch while reducing peak memory.'},
      {title:'Learning rate and training steps',body:'learning_rate=2e-4 controls update magnitude; max_steps=30 stops after 30 optimiser updates. Settings are deliberately modest for a learning experiment. Too much training can damage generalisation.'},
      {title:'Training loss is only part of the story',body:'When the loss decreases, the model is getting better at predicting the training examples. You still must test on unchanged unseen prompts and check correctness. Lower loss does not guarantee a more useful assistant.'},
    ],
    activity:'Follow the 14-step Colab Lab, inspect the trainer settings, then open the Training Simulator and compare healthy vs overfit illustrative curves.',
    quiz:{q:'What does a falling training loss prove?',options:['The model is definitely better at all tasks','The model predicts its training data more confidently','The model will now fit in any GPU'],correct:1,why:'Only held-out evaluation can provide evidence of generalisation.'}
  },
  {
    id:'evaluation',chapter:'07',title:'Evaluate before and after',duration:'20 min',level:'MEASUREMENT',icon:'chart',kicker:'Did it work?',
    intro:'You should capture a baseline before changing weights, then use the exact same test questions and generation settings after training.',
    analogy:'You cannot judge whether a training programme worked if you change the exam questions or grading rules between before and after.',
    learn:['Create a baseline before training','Separate formatting from meaning accuracy','Spot evaluation traps such as prompt-only compliance'],
    blocks:[
      {title:'Three separate questions',body:'Does it follow the specified two-line format? Is the meaning factually accurate? Is the code example valid? Grade these dimensions separately so the format score cannot hide incorrect answers.'},
      {title:'The “prompt already solved it” trap',body:'Our system prompt already asks for Meaning and Example. Qwen may follow it perfectly before training. If the baseline format score is already 100%, that particular metric has no room to improve. Evaluate another behaviour or loosen the prompt for both comparisons.'},
      {title:'Preserve fair conditions',body:'Keep the same prompt, held-out questions, generation parameters and scoring rules. Never manually improve the tuned answer before comparison. Inspect failures and record raw outputs in a CSV.'},
      {title:'Twelve questions are a classroom demo',body:'A 12-question test can expose obvious errors but cannot prove strong generalisation. Extend to a larger, more diverse, genuinely unseen evaluation set when the exercise works.'},
    ],
    activity:'Paste a real baseline and tuned answer into the Evaluation Studio and score structure, meaning and example separately.',
    quiz:{q:'If the original model already has 100% format compliance, what should you conclude?',options:['Fine tuning must be useless','That metric cannot show additional improvement','The model was secretly trained on your data'],correct:1,why:'A ceiling score is not an informative metric. Add other held-out quality dimensions.'}
  },
  {
    id:'export',chapter:'08',title:'Save, export and use Ollama',duration:'15 min',level:'DEPLOY',icon:'download',kicker:'Keep your work',
    intro:'Your Colab session can expire. After training and evaluation, save the learned LoRA adapter and optionally export a complete GGUF for local use.',
    analogy:'The LoRA adapter is the customisation file; the original Qwen model is the base machine. An exported GGUF packages a version ready for compatible inference tools.',
    learn:['Distinguish adapter files from full model files','Save artifacts before Colab expires','Use a correctly exported GGUF with Ollama'],
    blocks:[
      {title:'Saving the adapter',body:'model.save_pretrained("qwen_tutor_adapter") stores LoRA parameters and configuration. tokenizer.save_pretrained stores associated tokenizer files. Download the ZIP. This adapter is not necessarily a standalone complete model.'},
      {title:'Optional GGUF export',body:'Unsloth can export a compatible merged/converted model using save_pretrained_gguf and q4_k_m quantisation. Export can demand more temporary RAM and disk than the final file size, so treat it as optional.'},
      {title:'Run on Windows via Ollama',body:'Install Ollama, place the GGUF in a directory, create a Modelfile with FROM ./actual-file.gguf, then run ollama create qwen-tutor -f Modelfile and ollama run qwen-tutor. Use the actual produced filename.'},
      {title:'Your RTX 3050',body:'A tiny 0.6B Q4 model may run locally on a 4 GB RTX 3050, depending on available memory and runtime overhead. The full training experiment still takes place in Colab.'},
    ],
    activity:'Download the adapter ZIP. Only after a successful training and evaluation experiment, attempt the optional GGUF export.',
    quiz:{q:'Is a LoRA adapter ZIP the same thing as a complete GGUF model?',options:['Yes, always','No, the adapter is the learned modification to a base model','Yes, as long as it was trained in Colab'],correct:1,why:'Adapters contain separate trainable weights; GGUF is a full inference format used by many local runtimes.'}
  }
];

export const glossary=[
  ['Adapter','Small trainable set of parameters that modifies a larger frozen model.'],
  ['Batch size','How many examples a training step processes together.'],
  ['BF16 / FP16','16-bit formats used for many numerical calculations.'],
  ['Checkpoint','Files recording a model or training state so it can be restored.'],
  ['Colab runtime','Temporary cloud machine that executes notebook cells.'],
  ['CUDA','NVIDIA software platform that allows supported GPU computations.'],
  ['Dataset','Structured examples used for training or evaluation.'],
  ['Epoch','One full pass through the training dataset.'],
  ['Evaluation set','Questions kept separate from training to test generalisation.'],
  ['GGUF','A file format for efficient local model inference.'],
  ['Gradient','Signal used to work out how trainable weights should change.'],
  ['Gradient accumulation','Combining gradients from several small batches before updating weights.'],
  ['Inference','Using a trained model to produce an answer.'],
  ['Learning rate','Setting that influences how far parameters move on an update.'],
  ['LoRA','Low-rank adaptation: training compact weight updates instead of a full model.'],
  ['Loss','A numerical measure of model prediction error during training.'],
  ['Ollama','Software for running compatible language models locally.'],
  ['Overfitting','When a model learns training examples without improving on unseen ones.'],
  ['Parameter','A learned numerical value inside a neural network.'],
  ['QLoRA','LoRA with a quantised, usually 4-bit, frozen base model.'],
  ['Quantisation','Representing model weights with fewer bits to save memory.'],
  ['Rank','Size of LoRA’s compact learned update; often written r.'],
  ['Token','A chunk of text represented by an ID for model processing.'],
  ['Tokenizer','Software that converts text to token IDs and back.'],
  ['TRL','Hugging Face library with trainers such as SFTTrainer.'],
  ['Unsloth','Tooling to load and fine tune supported models efficiently.'],
  ['VRAM','Memory on your GPU, separate from your system RAM.'],
];
