# BUILD 39R1 sprite installation

Installs 32 Run keys across eight directions: 25 authored replacements/additions and seven recovered contacts. Exact file/source/anchor/SHA256 mapping is in art/raptor39r/installed.json. Front-left passing poses include the corrected two-hand shotgun grip. Rear Run keys use the corrected rear anatomy. All four frames in each direction share a registration anchor.

The renderer loads four Run keys and preserves movement-distance gait phase while firing, turning, stopping, and backpedaling. Shared movement/combat mechanics remain unchanged. Existing eight Idle and 24 Slide sprites are retained, for 64 runtime PNGs total.

Predeployment checks passed: production Next build; raptor39p, raptor39q, raptor39r tests; 64 unique 512x512 RGBA PNGs with genuine transparency and manifest hashes; sequential contact-sheet inspection. Browser cannot reach the local server; live browser verification follows isolated deployment and is reported separately.

Provisional: Walk borrows Run; stationary shooting, cover, psychic, jump/landing, and damage still lack dedicated complete artwork. Rear Idle and Slide artwork retain the prior release's limitations. Minor scale/equipment drift remains between authored Run keys. This is an installation increment, not completion of every BUILD39R family or its full gameplay matrix.

Recoverable parent: 846dec3cee5565274740c2dd88449491de57d5bc on studio/build39r-recovery-01. Original release: 9d7f6a840fc5542f9d8a44098731d8652d736ed8. Deploy only the isolated Raptor preview.
