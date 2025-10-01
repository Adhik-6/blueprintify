
## Running the app:
1. Fork and clone the repo.
2. Navigate to `server` folder and create a virtual environment:
   - `python -m venv venv`
   - Activate the environment:
     - Windows: `venv\Scripts\activate`
     - Mac/Linux: `source venv/bin/activate`

3. Install the required packages:
   - `pip install -r requirements.txt`

4. Start the server:
   - `python app.py`

5. Navigate to `client` folder and install dependencies:
   - `npm install`
  
6. Start the React app:
   - `npm run dev`

## Text-to-3D models:
1. [Robolox Cube](https://github.com/Roblox/cube)
2. OpenAI - [HuggingFace](https://huggingface.co/openai/shap-e), [GitHub](https://github.com/openai/shap-e)
3. [3DTopia](https://github.com/3DTopia/3DTopia)
4. [Hunyuan3D-2.1](https://huggingface.co/spaces/tencent/Hunyuan3D-2.1)
5. Trellis notebooks:
   - [Point-E](https://colab.research.google.com/github/trellis-llm/trellis/blob/main/notebooks/point_e.ipynb)
   - [DreamFusion](https://colab.research.google.com/github/trellis-llm/trellis/blob/main/notebooks/dreamfusion.ipynb)
   - [mine-1](https://colab.research.google.com/drive/1bsdGsWX3SAa9aBd7jDJHi7Vy7RxLoUv_?authuser=1#scrollTo=OlMACU0eWAfo&uniqifier=1) - almost working
6. [Tost AI](https://tost.ai) - via API

## Resources:
1. ChatGPT - [Roadmap 1](https://chatgpt.com/c/689f2068-2500-8325-af7f-0ce80e55ac70)

## Prompts:
1. To generate image using gemini:

- Main:
```
Create a high-quality, photorealistic 3D isometric floor plan of a modern house without a roof, designed for 3D model generation. The plan must clearly show the layout, walls, flooring, furniture placement, doors, windows, and room divisions from a top-down angled perspective.

The house should include:
Bedroom(s): [Bedroom 1: x ft, Bedroom 2: x ft, …]
Bathroom(s): [Bathroom 1: x ft, Bathroom 2: x ft, …]
Living room(s): [Living Room: x ft]
Kitchen(s): [Kitchen: x ft]
Dining area: [Dining: x ft]
Storeroom(s): [Storeroom: x ft] (optional)
Parking space: [x ft] (optional)
Other areas: [balcony, study, laundry, etc. with dimensions]

Scaling instruction: 1 foot = [__ pixels], all rooms and furniture must be drawn proportionally.

Furniture dimensions (adjust as needed):
Bed: 6.5x6 ft (king) / 6.5x5 ft (queen)
Sofa: 7x3 ft (3-seater), 5x3 ft (2-seater), 3x3 ft (single)
Dining table: 6x3 ft (rectangular, 6 chairs)
TV stand: 5x1.5 ft
Kitchen counter: 2.5 ft deep
Wardrobe: 6x2 ft
Bathroom: toilet (2.5x2 ft), sink (2x1.5 ft), shower (3x3 ft)
Parking: 10x18 ft per car / 7.5x18 ft per bike

Wall and opening dimensions:
Wall thickness: 8 inches
Interior doors: 3x7 ft
Main entry door: 3.5x7 ft
Windows: 4x5 ft (living/bedrooms), 2x3 ft (kitchen/bathrooms)

Design style: [modern / minimalistic / luxury / traditional]
Materials: [wooden flooring / tile flooring, neutral wall colors, glass windows, etc.]
Lighting: bright, evenly lit for clarity
Perspective: isometric top-down 3D angle, roof removed, all scaling applied consistently, suitable for 3D model conversion.
```

- Example:
```
Create a high-quality, photorealistic 3D isometric floor plan of a modern house without a roof, suitable for 3D model generation.

The house should include:
2 Bedrooms (Bedroom 1: 12x14 ft, Bedroom 2: 10x12 ft)
1 Bathroom (6x8 ft)
1 Living Room (14x16 ft)
1 Kitchen (10x12 ft)
1 Dining Area (10x10 ft)
1 Storeroom (6x6 ft)
Parking space for 1 car (10x18 ft).

Scaling instruction: 1 foot = 10 pixels, all rooms must be drawn proportionally.

Furniture dimensions:
Bedroom 1 → 6.5x6 ft king bed + 6x2 ft wardrobe
Bedroom 2 → 6.5x5 ft queen bed + 6x2 ft wardrobe
Living room → 7x3 ft sofa, 5x1.5 ft TV stand, 3x3 ft armchair
Dining area → 6x3 ft table with 6 chairs
Kitchen → 2.5 ft deep counter with cabinets, fridge, stove
Bathroom → toilet (2.5x2 ft), sink (2x1.5 ft), shower (3x3 ft)

Walls & Openings: Walls should be 8 inches thick.
Doors: interior doors 3x7 ft, main door 3.5x7 ft.
Windows: 4x5 ft in bedrooms & living, 2x3 ft in bathroom/kitchen.

Use a modern style with wooden flooring, light-colored walls, and realistic furniture. Bright evenly lit lighting. Perspective must be clean isometric, roof removed, all scaling applied consistently for accurate 3D model conversion.
```


- balcony for rooms & livingroom
- bathrooms for rooms & livingroom

"Create a high-quality, photorealistic 3D isometric floor plan of a house without a roof, designed for 3D model generation. The plan must clearly show the layout, walls, flooring, furniture placement, doors, windows, and room divisions from a top-down angled perspective.

The house should include:
3 Bedroom(s):
	- Bedroom 1: 13x12 ft, with Bathroom 5x6 ft, should include a balcony.,
	- Bedroom 2: 12x11 ft, with Bathroom 6x5 ft.,
	- Bedroom 3: 10x10 ft.
1 Living room: 17x17 ft, should include a balcony, Bathroom with 4x7 ft attached to the living room
1 Kitchen: 15x12 ft
Include a Dining area in between the living room and kitchen

Parking space: Enough to accommodate 2 cars & 3 motorbikes



Scaling instruction: 1 foot = 10 pixels; all rooms and furniture must be drawn proportionally.

Furniture dimensions (adjust as needed):
Bed: 6.5x6 ft (king) / 6.5x5 ft (queen)
Sofa: 7x3 ft (3-seater), 5x3 ft (2-seater), 3x3 ft (single)
Dining table: 6x3 ft (rectangular, 6 chairs)
TV stand: 5x1.5 ft
Kitchen counter: 2.5 ft deep
Wardrobe: 6x2 ft
Bathroom: toilet (2.5x2 ft), sink (2x1.5 ft), shower (3x3 ft)
Parking: 10x18 ft per car / 7.5x18 ft per bike

Wall and opening dimensions:
Wall thickness: 8 inches
Interior doors: 3x7 ft
Main entry door: 3.5x7 ft
Windows: 4x5 ft (living/bedrooms), 2x3 ft (kitchen/bathrooms)

Design style: minimalistic
Materials: wooden flooring, neutral wall colors, glass windows
Lighting: bright, evenly lit for clarity
Perspective: isometric top-down 3D angle, roof removed, all scaling applied consistently, suitable for 3D model conversion."