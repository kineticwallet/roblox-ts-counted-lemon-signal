import { Connection, Signal, SignalCallback } from "@rbxts/lemon-signal";

export class LemonSignalCounter<T> {
	private Signal: Signal<T>;
	private OnConnectionsChanged = new Signal<number>();
	private TotalConnections = 0;

	public constructor(signal: Signal<T>) {
		this.Signal = signal;
	}

	public Connect(fn: SignalCallback<T>): Connection<T> {
		this.TotalConnections++;
		this.OnConnectionsChanged.Fire(1);
		return this.Signal.Connect(fn);
	}

	public DisconnectAll(): void {
		this.OnConnectionsChanged.Fire(-this.TotalConnections);
		this.TotalConnections = 0;
		this.Signal.DisconnectAll();
	}

	public Disconnect(connection: Connection<T>): void {
		this.TotalConnections--;
		this.OnConnectionsChanged.Fire(-1);
		connection.Disconnect();
	}

	public Reconnect(connection: Connection<T>): void {
		this.TotalConnections++;
		this.OnConnectionsChanged.Fire(1);
		connection.Reconnect();
	}

	public Destroy(): void {
		this.OnConnectionsChanged.Destroy();
		table.clear(this);
		setmetatable(this, undefined!);
	}
}
