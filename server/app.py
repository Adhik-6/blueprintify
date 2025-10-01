from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os, time

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask backend running ✅"}), 200


@app.route("/api/generate-img", methods=["POST"])
def generate_img():
    data = request.get_json()

    # ---- Extract data ----
    land = data.get("land", {})
    bedrooms = data.get("bedrooms", [])
    living_room = data.get("livingRoom", {})
    kitchen = data.get("kitchen", {})
    parking = data.get("parking", {})
    storerooms = data.get("storerooms", [])
    laundry = data.get("laundry", None)
    custom_rooms = data.get("customRooms", [])
    style = data.get("style", "modern")

    # ---- Build room sections ----
    room_lines = []

    # Bedrooms
    for i, b in enumerate(bedrooms):
        line = f"- Bedroom {i+1}: {b['length']}x{b['width']} ft"
        if b.get("bathroom", {}).get("included"):
            bath = b["bathroom"]
            line += f", attached Bathroom: {bath.get('length','?')}x{bath.get('width','?')} ft"
        if b.get("balcony"):
            line += ", with Balcony"
        room_lines.append(line)

    # Living room
    if living_room:
        line = f"- Living Room: {living_room.get('length','?')}x{living_room.get('width','?')} ft"
        if living_room.get("bathroom", {}).get("included"):
            bath = living_room["bathroom"]
            line += f", attached Bathroom: {bath.get('length','?')}x{bath.get('width','?')} ft"
        if living_room.get("balcony"):
            line += ", with Balcony"
        room_lines.append(line)

    # Kitchen
    if kitchen:
        line = f"- Kitchen: {kitchen.get('length','?')}x{kitchen.get('width','?')} ft"
        room_lines.append(line)

    # Dining area (optional)
    if living_room.get("dining"):
        room_lines.append("- Dining area: Between Living Room and Kitchen")

    # Storerooms
    for i, s in enumerate(storerooms):
        room_lines.append(f"- Storeroom {i+1}: {s['length']}x{s['width']} ft")

    # Laundry
    if laundry:
        room_lines.append(f"- Laundry: {laundry['length']}x{laundry['width']} ft")

    # Custom rooms
    for c in custom_rooms:
        room_lines.append(f"- {c['name']}: {c['length']}x{c['width']} ft (empty)")

    # Parking
    if parking.get("mode") == "dimensions":
        if parking.get("length") and parking.get("width"):
            room_lines.append(f"- Parking: {parking['length']}x{parking['width']} ft")
    elif parking.get("mode") == "vehicles":
        cars = parking.get("cars", "0")
        bikes = parking.get("bikes", "0")
        if cars != "0" or bikes != "0":
            room_lines.append(f"- Parking: Enough for {cars} car(s) & {bikes} bike(s) "
                              f"(10x18 ft per car, 7.5x18 ft per bike)")

    # ---- Final structured prompt ----
    prompt = f"""
Generate a 3D isometric floor plan without roof. Show walls, flooring, furniture placement, doors, windows, and room divisions clearly. Output must be suitable for 3D model generation.

The total area is {land.get('length','?')}x{land.get('width','?')} ft.

Rooms and dimensions (in feet):
{chr(10).join(room_lines)}

Scaling:
- 1 foot = 10 pixels
- All rooms and furniture proportional

Furniture sizes:
- Bed: 6.5x6 (king), 6.5x5 (queen)
- Sofa: 7x3 (3-seater), 5x3 (2-seater), 3x3 (single)
- Dining table: 6x3, 6 chairs
- TV stand: 5x1.5
- Kitchen counter: 2.5 deep
- Wardrobe: 6x2
- Bathroom: toilet 2.5x2, sink 2x1.5, shower 3x3

Wall and openings:
- Wall thickness: 8 inches
- Interior door: 3x7
- Main door: 3.5x7
- Windows: 4x5 (living/bedrooms), 2x3 (kitchen/bathrooms)

Design:
- Style: {style}
- Materials: wooden flooring, neutral walls, glass windows
- Lighting: bright, evenly lit
- Perspective: isometric top-down, roof removed
""".strip()

    return jsonify({
        "status": "success",
        "prompt": prompt
    }), 200

i = j = 1
@app.route("/api/get-sample-model", methods=["POST"])
def get_sample_model():
    data = request.get_json()
    bedrooms = data.get("bedrooms", [])
    n = len(bedrooms)
    z=1
    if n > 1:
        global j
        j = j % 3 + 1
        z = j
    else:
        global i
        i = i % 3 + 1
        z = i

    try:
        time.sleep(1)
        # file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), f"../client/src/assets/models/house_{n}_{z}.glb"))
        # return send_file(file_path, mimetype="model/gltf-binary")
        return jsonify({ "n": [n, z] }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
