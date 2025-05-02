
import { useState } from "react";
import { Activity, Play, X, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Mock data for packets
const mockPackets = [
  { id: 1, time: "15:32:45.123", source: "192.168.1.5", destination: "8.8.8.8", protocol: "TCP", size: 64, info: "SYN, Seq=0" },
  { id: 2, time: "15:32:45.245", source: "8.8.8.8", destination: "192.168.1.5", protocol: "TCP", size: 64, info: "SYN, ACK, Seq=0, Ack=1" },
  { id: 3, time: "15:32:45.356", source: "192.168.1.5", destination: "8.8.8.8", protocol: "TCP", size: 52, info: "ACK, Seq=1, Ack=1" },
  { id: 4, time: "15:32:45.589", source: "192.168.1.5", destination: "8.8.8.8", protocol: "HTTP", size: 124, info: "GET / HTTP/1.1" },
  { id: 5, time: "15:32:45.789", source: "8.8.8.8", destination: "192.168.1.5", protocol: "HTTP", size: 1024, info: "HTTP/1.1 200 OK" }
];

export function Sniffer() {
  const [isSniffing, setIsSniffing] = useState(false);
  const [packets, setPackets] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedPacket, setSelectedPacket] = useState<any>(null);
  const [interface_, setInterface] = useState("eth0");
  const [captureSize, setCaptureSize] = useState(65536);

  const handleStartSniffer = () => {
    setIsSniffing(true);
    setPackets([]);
    
    // Simulate packets arriving
    let packetIndex = 0;
    const interval = setInterval(() => {
      if (packetIndex < mockPackets.length) {
        setPackets(prev => [...prev, mockPackets[packetIndex]]);
        packetIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleStopSniffer = () => {
    setIsSniffing(false);
  };

  const filteredPackets = filter
    ? packets.filter(packet => 
        packet.source.includes(filter) || 
        packet.destination.includes(filter) || 
        packet.protocol.toLowerCase().includes(filter.toLowerCase())
      )
    : packets;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Packet Sniffer</h2>
        <div className="text-sm text-muted-foreground">
          {isSniffing ? "Capturing packets..." : "Ready to capture"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="p-6 border-b border-cyber-muted">
            <h3 className="font-medium text-lg flex items-center">
              <Activity size={18} className="mr-2 text-cyber-accent" />
              Sniffer Configuration
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interface">Network Interface</Label>
              <select 
                id="interface"
                className="w-full bg-cyber-muted border border-cyber-accent/20 rounded p-2"
                value={interface_}
                onChange={(e) => setInterface(e.target.value)}
              >
                <option value="eth0">eth0</option>
                <option value="wlan0">wlan0</option>
                <option value="lo">lo (loopback)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capture-size">Capture Size</Label>
              <Input
                id="capture-size"
                type="number"
                value={captureSize}
                onChange={(e) => setCaptureSize(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="promiscuous">Promiscuous Mode</Label>
              <Switch id="promiscuous" />
            </div>

            <div className="pt-4">
              <Button 
                onClick={isSniffing ? handleStopSniffer : handleStartSniffer}
                className={isSniffing ? "bg-destructive hover:bg-destructive/90 w-full" : "bg-cyber-accent hover:bg-cyber-info w-full"}
              >
                {isSniffing ? (
                  <X className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isSniffing ? "Stop Sniffer" : "Start Sniffer"}
              </Button>
            </div>

            {(packets.length > 0 || isSniffing) && (
              <div className="pt-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Packets captured: {packets.length}</span>
                  <button className="text-cyber-accent hover:text-cyber-info transition-colors flex items-center">
                    <Download size={14} className="mr-1" /> Save PCAP
                  </button>
                </div>
                
                <div className="flex space-x-2 items-center">
                  <Filter size={16} className="text-muted-foreground" />
                  <Input 
                    placeholder="Filter (IP, protocol...)" 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="packets">
            <div className="border-b border-cyber-muted">
              <div className="px-6 pt-6 pb-2">
                <TabsList className="bg-cyber-muted">
                  <TabsTrigger value="packets">Packets</TabsTrigger>
                  <TabsTrigger value="details">Packet Details</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="packets" className="p-6">
              {filteredPackets.length > 0 ? (
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full data-table">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Time</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Protocol</th>
                        <th>Length</th>
                        <th>Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPackets.map((packet) => (
                        <tr 
                          key={packet.id} 
                          className={selectedPacket?.id === packet.id ? "bg-cyber-accent/20" : ""}
                          onClick={() => setSelectedPacket(packet)}
                        >
                          <td>{packet.id}</td>
                          <td>{packet.time}</td>
                          <td>{packet.source}</td>
                          <td>{packet.destination}</td>
                          <td>
                            <span className="bg-cyber-muted px-2 py-1 rounded text-xs">
                              {packet.protocol}
                            </span>
                          </td>
                          <td>{packet.size} bytes</td>
                          <td>{packet.info}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Activity size={48} className="mb-4" />
                  <p>No packets captured yet. Start the sniffer to begin capturing.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="p-6">
              {selectedPacket ? (
                <div className="space-y-4">
                  <div className="bg-cyber-secondary p-4 rounded-md">
                    <h4 className="text-lg font-medium mb-2">Packet #{selectedPacket.id}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-cyber-accent mb-1">Frame</h5>
                        <div className="bg-cyber-primary p-3 rounded">
                          <p className="font-mono text-sm">
                            Time: {selectedPacket.time}<br />
                            Length: {selectedPacket.size} bytes
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-cyber-accent mb-1">Internet Protocol</h5>
                        <div className="bg-cyber-primary p-3 rounded">
                          <p className="font-mono text-sm">
                            Source IP: {selectedPacket.source}<br />
                            Destination IP: {selectedPacket.destination}<br />
                            Protocol: {selectedPacket.protocol}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-cyber-accent mb-1">Protocol Data</h5>
                        <div className="bg-cyber-primary p-3 rounded">
                          <p className="font-mono text-sm">
                            {selectedPacket.info}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-cyber-accent mb-1">Hex Dump</h5>
                        <pre className="bg-cyber-primary p-3 rounded font-mono text-xs overflow-x-auto">
                          00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F<br />
                          45 00 00 3C 1C 46 40 00 40 06 B1 E6 C0 A8 01 05<br />
                          08 08 08 08 9B 90 00 50 00 00 00 00 A0 02 72 10<br />
                          7C D8 00 00 02 04 05 B4 04 02 08 0A 03 53 60 34
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Activity size={48} className="mb-4" />
                  <p>Select a packet to view its details.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="p-6">
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Activity size={48} className="mb-4" />
                <p>Statistics will be available after capturing packets.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default Sniffer;
